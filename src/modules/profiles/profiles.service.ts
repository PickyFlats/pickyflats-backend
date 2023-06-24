import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
  ) {}

  // create profile without any data on registering new user
  async createProfile(userId: string): Promise<Profile> {
    const createdProfile = new this.profileModel({
      userId: new Types.ObjectId(userId),
    });
    return createdProfile.save();
  }

  async updateProfileByUserId(userId: string, updateData: Partial<Profile>) {
    const updatedProfile = await this.profileModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      updateData,
    );
    return updatedProfile;
  }

  async updateProfile(
    profileId: string,
    updateData: Partial<Profile>,
  ): Promise<Profile> {
    const updatedProfile = await this.profileModel.findByIdAndUpdate(
      profileId,
      updateData,
    );
    return updatedProfile;
  }

  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!profile) {
      throw new NotFoundException('Invalid profile');
    }
    return profile?.toJSON();
  }

  async deleteProfile(profileId: string): Promise<Profile> {
    const deletedProfile = await this.profileModel.findByIdAndDelete(profileId);
    return deletedProfile;
  }
}
