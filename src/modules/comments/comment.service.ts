import { Injectable, Param } from '@nestjs/common';
import { commentDTO } from './data/comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/commentSchema';
import { Model } from 'mongoose';

@Injectable()
export class commentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}
  public comments: commentDTO[] = [];

  // Post
  async addCommentService(commentId, data: commentDTO) {
    let comment = await this.commentModel.findOne({ Id: commentId });
    if (!comment) {
      comment = await this.commentModel.create(data);
    }
  }

  //update comment service

  updateCommentService(comment: commentDTO): string {
    const index = this.comments.findIndex((currentComment) => {
      return currentComment.id == comment.id;
    });

    this.comments[index] = comment;

    return 'Comment updated success';
  }

  //delete comment service

  deleteCommentService(id: string): string {
    this.comments = this.comments.filter((c) => {
      return c.id != id;
    });

    return 'comment deleted success';
  }

  //find all comments
  async getAllComments() {
    return this.commentModel.find();
  }

  async getOneComment(@Param('id') id: string) {
    return this.commentModel.findById(id);
  }

  //find comment for one listing
  async getListingComments(listingId: string) {
    return this.commentModel.find({ listingId: listingId });
  }
}
