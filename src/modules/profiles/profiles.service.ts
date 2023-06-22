import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
  ) {}

  // create profile without any data on registering new user
  async createProfile(userId: string): Promise<Profile> {
    const createdProfile = new this.profileModel({ userId });
    return createdProfile.save();
  }

  async updateProfile(
    profileId: string,
    updateData: Partial<Profile>,
  ): Promise<Profile> {
    const updatedProfile = await this.profileModel.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true },
    );
    return updatedProfile;
  }

  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId });
    return profile;
  }

  async deleteProfile(profileId: string): Promise<Profile> {
    const deletedProfile = await this.profileModel.findByIdAndDelete(profileId);
    return deletedProfile;
  }
}
