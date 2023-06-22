import { Injectable } from '@nestjs/common';
import { comment } from './data/comment.dto';

@Injectable()
export class commentService {
  public comments: comment[] = [];

  //add comment service
  addCommentService(comment: comment): string {
    this.comments.push(comment);
    return 'Comment Has Been added';
  }

  //update comment service

  updateCommentService(comment: comment): string {
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
  findAllComments(): comment[] {
    return this.comments;
  }
}
