import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  @Post(['/create-connection'])
  async createConnection(
    @Request() req,
    @Res() response,
    @Body() createConnectionDto: CreateConnectionDto,
  ) {
    const userId = req.user?.sub;
    try {
      const connectionId = await this.chatService.createConnection({
        ...createConnectionDto,
        chatStarter: userId,
      });
      return response.send(connectionId);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  // get current user conversations
  @Get('/conversations/me')
  async getConversationsBySessionUser(@Request() req, @Res() response) {
    const userId = req.user?.sub;
    try {
      const conversations = await this.chatService.fetchConversationsByUserId(
        userId,
      );
      return response.json(conversations);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
  @Get('/conversations/:id')
  async getConversationById(@Param('id') conversationId, @Res() response) {
    try {
      const conversations = await this.chatService.getConversationById(
        conversationId,
      );
      return response.json(conversations);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Get('/messages/c/:conversationId')
  async getMessagesByConversationId(
    @Param('conversationId') conversationId,
    @Res() response,
  ) {
    try {
      const messages = await this.messageService.getMessagesByConversationId(
        conversationId,
      );
      return response.json(messages);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Post('/messages/new')
  async newMessage(
    @Request() req,
    @Res() response,
    @Body() newMessage: CreateMessageDto,
  ) {
    try {
      const userId = req.user?.sub;
      const newMessageId = await this.messageService.createMessage({
        ...newMessage,
        senderID: userId, // senderid will always be session user
      });
      return response.json(newMessageId);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @Delete('/message/:id')
  async deleteMessageById(@Res() response, @Param('id') id: string) {
    try {
      await this.messageService.deleteMessageById(id);
      response.end();
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
