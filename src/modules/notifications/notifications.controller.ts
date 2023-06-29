import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post('/create-notification')
  async createNotification(
    @Request() req,
    @Res() response,
    @Body() notificationDto: CreateNotificationDto,
  ) {
    try {
      const userId = req.user?.sub;

      const newNotitification =
        await this.notificationService.createNotification({
          ...notificationDto,
          userId,
        } as any);

      return response.json(newNotitification);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Get('/me')
  async fetchCurrentUserNotification(@Request() req, @Res() response) {
    try {
      const userId = req.user?.sub;

      const notifications =
        await this.notificationService.getNotificationsByUserId(userId);

      // return response.json(notifications);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }
}
