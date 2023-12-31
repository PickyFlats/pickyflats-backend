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
  Request,
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

  @Post('/add')
  async addComments(
    @Request() req,
    @Res() response,
    @Body() comment: commentDTO,
  ) {
    try {
      const userId = req.user?.sub;

      const newComment = await this.CommentService.addCommentService({
        ...comment,
        userId,
      } as any);

      return response.json(newComment);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Get(['/:id'])
  async getCommentById(@Res() response, @Param('id') id: string) {
    // return this.CommentService.findAllComments();
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

  @Get('listing/:id')
  async getListingComments(@Res() response, @Param('id') listingId: string) {
    try {
      const listingComments = await this.CommentService.getListingComments(
        listingId,
      );

      return response.json(listingComments);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

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

  // patch ok

  @Patch(['/:id'])
  async updateListing(
    @Request() req,
    @Res() response,
    @Param('id') commentId: string,
    @Body() commentDTO: commentDTO,
  ) {
    try {
      // const userId = req.user?.sub;
      await this.CommentService.updateCommentById(commentId, commentDTO);
      response.end();
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }
}
