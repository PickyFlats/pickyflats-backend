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
  Patch,
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

  @Get(['/:id'])
  async getCommentById(@Res() response, @Param('commentId') id: string) {
    // return this.CommentService.findAllComments();
    console.log('!!!!!!!');
    try {
      const oneComment = await this.CommentService.getCommentById(id);
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

  //delete

  @Delete(['/:id'])
  async deleteListingById(@Res() response, @Param('id') deleteID: string) {
    try {
      await this.CommentService.deleteCommentById(deleteID);
      response.end();
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }
}
