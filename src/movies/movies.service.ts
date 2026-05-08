import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './schemas/movie.schema';
import { Role } from '../users/schemas/user.schema';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async findAll(query: { genre?: string; search?: string; minPrice?: number; maxPrice?: number }) {
    const filter: any = { isActive: true };
    if (query.genre) filter.genre = query.genre;
    if (query.search) filter.title = { $regex: query.search, $options: 'i' };
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = query.minPrice;
      if (query.maxPrice) filter.price.$lte = query.maxPrice;
    }
    return this.movieModel.find(filter).populate('seller', 'fullName email').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const movie = await this.movieModel.findById(id).populate('seller', 'fullName email').exec();
    if (!movie) throw new NotFoundException('Kino topilmadi');
    return movie;
  }

  async create(data: any, user: any) {
    const newMovie = new this.movieModel({ ...data, seller: user.sub });
    return newMovie.save();
  }

  async update(id: string, data: any, user: any) {
    const movie = await this.movieModel.findById(id);
    if (!movie) throw new NotFoundException('Kino topilmadi');
    if (user.role !== Role.ADMIN && movie.seller.toString() !== user.sub) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }
    return this.movieModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string, user: any) {
    const movie = await this.movieModel.findById(id);
    if (!movie) throw new NotFoundException('Kino topilmadi');
    if (user.role !== Role.ADMIN && movie.seller.toString() !== user.sub) {
      throw new ForbiddenException('Ruxsat yo\'q');
    }
    await this.movieModel.findByIdAndDelete(id).exec();
    return { success: true, message: "Kino o'chirildi" };

  }
}
