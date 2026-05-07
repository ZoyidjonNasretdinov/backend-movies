import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Role } from './schemas/user.schema';
import { Order } from '../orders/schemas/order.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async findAll(query: { role?: Role; search?: string }) {
    const filter: any = {};
    if (query.role) filter.role = query.role;
    if (query.search) {
      filter.$or = [
        { fullName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }
    return this.userModel.find(filter).select('-passwordHash').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-passwordHash').exec();
    if (!user) throw new NotFoundException('Topilmadi');
    return user;
  }

  async update(id: string, data: any) {
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.passwordHash = await bcrypt.hash(data.password, salt);
      delete data.password;
    }
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).select('-passwordHash').exec();
  }

  async remove(id: string) {
    await this.userModel.findByIdAndDelete(id).exec();
    return { success: true };
  }

  async getMyOrders(userId: string) {
    return this.orderModel.find({ userId }).populate('movieId').sort({ createdAt: -1 }).exec();
  }
}
