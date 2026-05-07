import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Role } from '../users/schemas/user.schema';
import { Movie } from '../movies/schemas/movie.schema';
import { Order } from '../orders/schemas/order.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async getAdminStats() {
    const [users, sellers, movies, revenue] = await Promise.all([
      this.userModel.countDocuments({ role: Role.USER }),
      this.userModel.countDocuments({ role: Role.SELLER }),
      this.movieModel.countDocuments(),
      this.orderModel.aggregate([{ $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    ]);
    return {
      totalUsers: users,
      totalSellers: sellers,
      totalMovies: movies,
      totalRevenue: revenue[0]?.total || 0,
      totalOrders: revenue[0]?.count || 0,
    };
  }

  async getSellerStats(sellerId: string) {
    const myMovies = await this.movieModel.find({ sellerId }).select('_id');
    const movieIds = myMovies.map(m => m._id);
    const [count, sales] = await Promise.all([
      this.movieModel.countDocuments({ sellerId }),
      this.orderModel.aggregate([
        { $match: { movieId: { $in: movieIds } } },
        { $group: { _id: null, revenue: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
    ]);
    return {
      myMoviesCount: count,
      myRevenue: sales[0]?.revenue || 0,
      mySalesCount: sales[0]?.count || 0,
    };
  }
}
