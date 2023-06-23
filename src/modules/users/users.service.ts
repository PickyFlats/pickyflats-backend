import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password');
    return user.toJSON();
  }

  async updateUserById(
    userId: string,
    updateData: UpdateUserDto,
  ): Promise<boolean> {
    await this.userModel.findByIdAndUpdate(userId, updateData);
    return true;
  }
}
