import { Injectable, Param } from '@nestjs/common';
import { likeDTO } from './data/like.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from './schemas/likeSchema';
import { Model, Types } from 'mongoose';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name)
    private readonly likeModel: Model<Comment>,
  ) {}
  public likes: likeDTO[] = [];

  // Post :working
  async addLikeService(data: likeDTO) {
    await this.likeModel.create(data);
  }

  //find all likes: working
  async getAllLikes() {
    return this.likeModel.find();
  }
  //find like by id
  async getLikeById(@Param('_id') id: string) {
    return this.likeModel.findById(id);
  }

  //find likes for one listing
  async getListingLikes(listingId: string) {
    return this.likeModel.find({ listingId: listingId });
  }

  //delete like

  async deleteLikeById(likeID) {
    await this.likeModel.findByIdAndDelete(likeID);
    // !TODO: clean gallery images
    await this.likeModel.deleteOne({
      likeId: new Types.ObjectId(likeID),
    });
  }
}
