import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messagesModel: Model<Message>,
    @Inject(forwardRef(() => ChatGateway)) private chatGateway: ChatGateway,
  ) {}

  async getMessagesByConversationId(conversationID) {
    return this.messagesModel.find({ conversationID });
  }

  async createMessage(message: CreateMessageDto) {
    const newMessage = await this.messagesModel.create(message);
    return newMessage.toJSON();
  }

  async deleteMessageById(id) {
    const message = await this.messagesModel.findById(id);
    // find
    //! todo delete attachments also if exits
    await this.messagesModel.findByIdAndDelete(id);
    // this.chatGateway.server.to()
    //! push update to socket for msg deleted
  }
}
