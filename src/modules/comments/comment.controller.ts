import {
  Controller,
  Get,
  Put,
  Body,
  Delete,
  Param,
  Post,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { commentService } from './comment.service';
import { commentDTO } from './data/comment.dto';

@Controller('comments')
export class CommentController {
  constructor(public CommentService: commentService) {}

  @Get('findall')
  async getFullComments(@Res() response) {
    // return this.CommentService.findAllComments();
    console.log('fff');
    try {
      const allComments = await this.CommentService.getAllComments();
      return response.json(allComments);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Get(':id')
  async getOneComment(@Res() response, @Param('_id') id: string) {
    // return this.CommentService.findAllComments();
    console.log('!!!!!!!');
    try {
      const oneComment = await this.CommentService.getOneComment(id);
      return response.json(oneComment);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Get('list/:listingId')
  async getListingComments(
    @Res() response,
    @Param('listingId') listingId: string,
  ) {
    // return this.CommentService.findAllComments();

    try {
      const listingComments = await this.CommentService.getListingComments(
        listingId,
      );
      console.log('inside##########');
      return response.json(listingComments);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Put('/update')
  async updateComments(@Body() comment: commentDTO) {
    return this.CommentService.updateCommentService(comment);
  }

  @Delete('/delete/:id')
  async deleteComments(@Param('id') commentId: string) {
    return this.CommentService.deleteCommentService(commentId);
  }

  @Post('/add')
  async addComments(@Res() response, @Body() comment: commentDTO) {
    try {
      await this.CommentService.addCommentService(comment.id, comment);
      return response.json({ created: true });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }
}
