import {
  Controller,
  Get,
  Put,
  Body,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { commentService } from './comment.service';
import { comment } from './data/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private CommentService: commentService) {}

  @Get('findall')
  getAllComments(): comment[] {
    return this.CommentService.findAllComments();
  }

  @Put('/update')
  updateComments(@Body() comment: comment): string {
    return this.CommentService.updateCommentService(comment);
  }

  @Delete('/delete/:id')
  deleteComments(@Param('id') commentId: string): string {
    return this.CommentService.deleteCommentService(commentId);
  }

  @Post('/add')
  addComments(@Body() comment: comment): string {
    return this.CommentService.addCommentService(comment);
  }
}
