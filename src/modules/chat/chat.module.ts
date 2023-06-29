import { Module, forwardRef } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from './schemas/conversation.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { MessageService } from './message.service';
import { ChatGateway } from './chat.gateway';
import { APP_GUARD } from '@nestjs/core';
import { SocketAuthenticationMiddleware } from 'src/common/middleware/socket.middleware';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    MessageService,
    {
      provide: APP_GUARD,
      useClass: SocketAuthenticationMiddleware,
    },
    ChatGateway,
  ],
})
export class ChatModule {}
