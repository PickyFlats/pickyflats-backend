import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(forwardRef(() => ProfilesService))
    private profileService: ProfilesService,
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

  async validateUserById(id: string) {
    const user = await this.userModel.findById(id).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUsersDataByIds(ids: string[]) {
    const users = await this.userModel
      .find({
        _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
      })
      .select('firstName lastName accountType');
    return users;
  }

  async getUsersWithProfiles(ids: string[]) {
    const users = await this.getUsersDataByIds(ids);
    const userProfiles = await this.profileService.getUserProfiles(ids);
    const userWithProfiles = users.map((user) => {
      const userProfile = userProfiles
        .find((p) => p.userId.toString() === user.id)
        ?.toJSON();
      return { ...user.toJSON(), ...userProfile };
    });
    return userWithProfiles;
  }
}
