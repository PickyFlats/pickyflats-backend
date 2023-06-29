import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { CreateConnectionDto } from '../chat/dto/create-connection.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async createNotification(createNotification: CreateConnectionDto) {
    return this.notificationModel.create(createNotification);
  }

  async getNotificationsByUserId(userId: string) {
    // fetch user notifications
  }
}
