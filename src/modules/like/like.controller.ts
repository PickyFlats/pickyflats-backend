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
import { LikeService } from './like.service';
import { likeDTO } from './data/like.dto';

@Controller('likes')
export class likeController {
  constructor(public LikeService: LikeService) {}

  @Get('findall')
  async getFullLikes(@Res() response) {
    // return this.CommentService.findAllComments();
    console.log('fff');
    try {
      const allLikes = await this.LikeService.getAllLikes();
      return response.json(allLikes);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Post('/add')
  async addLikes(@Res() response, @Body() like: likeDTO) {
    try {
      await this.LikeService.addLikeService(like);
      return response.json({ created: true });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Get(['/:id'])
  async getLikeById(@Res() response, @Param('id') id: string) {
    // return this.CommentService.findAllComments();
    console.log('!!!!!!!');
    try {
      const oneLike = await this.LikeService.getLikeById(id);
      return response.json(oneLike);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Get('list/:listingId')
  async getListingLikes(
    @Res() response,
    @Param('listingId') listingId: string,
  ) {
    try {
      const listingLikes = await this.LikeService.getListingLikes(listingId);
      console.log('inside##########');
      return response.json(listingLikes);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  //delete ok

  @Delete(['/:id'])
  async deleteLikeById(@Res() response, @Param('id') deleteID: string) {
    try {
      await this.LikeService.deleteLikeById(deleteID);
      response.end();
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  // patch ok
}
