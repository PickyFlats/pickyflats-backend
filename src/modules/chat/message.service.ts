import { Injectable } from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messagesModel: Model<Message>,
  ) {}

  async getMessagesByConversationId(conversationID) {
    return this.messagesModel.find({ conversationID });
  }

  async createMessage(message: CreateMessageDto) {
    const newMessage = await this.messagesModel.create(message);
    return newMessage.toJSON();
  }
}
