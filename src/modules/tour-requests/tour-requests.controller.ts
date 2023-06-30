import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { TourRequestsService } from './tour-requests.service';

@Controller('tour-requests')
export class TourRequestsController {
  constructor(private readonly tourRequestService: TourRequestsService) {}

  @Post('/new')
  async createTourRequest(@Request() req, @Res() response, @Body() data) {
    try {
      const userId = req.user?.sub;
      const newTourRequest = await this.tourRequestService.createRequestForTour(
        {
          ...data,
          userId,
        },
      );
      //   return response.json(newTourRequest);
      return response.json({ $id: newTourRequest.id });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      });
    }
  }

  @Post('/:id')
  async updateTourRequest(
    @Res() response,
    @Param('id') tourRequestId: string,
    @Body() update,
  ) {
    try {
      await this.tourRequestService.updateTourRequestById(
        tourRequestId,
        update,
      );
      response.end();
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      });
    }
  }

  @Get('/me')
  async getTourRequests(@Request() req, @Res() response) {
    try {
      const userId = req.user?.sub;
      const tourRequests =
        await this.tourRequestService.getTourRequestsForSeller(userId);
      return response.json(tourRequests);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: err.message,
      });
    }
  }
}
