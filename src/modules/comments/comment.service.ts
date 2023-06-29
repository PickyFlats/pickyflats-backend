import { Injectable, Param } from '@nestjs/common';
import { commentDTO } from './data/comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/commentSchema';
import { Model, Types } from 'mongoose';
import { ProfilesService } from '../profiles/profiles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class commentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
    private readonly profileService: ProfilesService,
    private readonly usersService: UsersService,
  ) {}

  // Post :working
  async addCommentService(data: commentDTO) {
    return this.commentModel.create(data);
  }

  //find all comments: working
  async getAllComments() {
    return this.commentModel.find();
  }
  //find comment by id
  async getCommentById(@Param('_id') id: string) {
    return this.commentModel.findById(id);
  }

  //find comments for one listing
  async getListingComments(listingId: string) {
    const comments = await this.commentModel.find({ listingId: listingId });

    const commentUserIDs = [
      ...new Set(comments.flatMap((res) => res.userId.toString())),
    ];

    //comments with all users profiles
    const userProfiles = await this.profileService.getUserProfiles(
      commentUserIDs,
    );
    const users = await this.usersService.getUsersDataByIds(commentUserIDs);

    const commentsWithUserInfo = comments.map((c) => {
      const user = users.find((u) => u.id === c.userId.toString())?.toJSON();
      const userProfile = userProfiles
        .find((u) => u.userId.toString() === c.userId.toString())
        ?.toJSON();
      return { ...c.toJSON(), user: { ...user, ...userProfile } };
    });

    return commentsWithUserInfo;
  }

  //delete comment

  async deleteCommentById(commentID) {
    await this.commentModel.findByIdAndDelete(commentID);
    // !TODO: clean gallery images
    await this.commentModel.deleteOne({
      commentId: new Types.ObjectId(commentID),
    });
  }

  //update comment

  async updateCommentById(commentId, update: Partial<Comment>) {
    await this.commentModel.findByIdAndUpdate(commentId, { $set: update });
  }
}
