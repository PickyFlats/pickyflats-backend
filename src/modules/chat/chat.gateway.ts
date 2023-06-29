import { SetMetadata, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Role } from '../auth/decorators/roles.decorator';
import { Roles } from '../auth/roles.enum';
import { SocketAuthGuard } from './socket.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';

const UseSocketMiddleware = (...middlewares: any[]) =>
  SetMetadata('socketMiddlewares', middlewares);

@UseGuards(SocketAuthGuard)
// @UseGuards(SocketAuthenticationMiddleware)
// @Role(Roles.USER)
@WebSocketGateway({
  // path: '/chatIO',
  // cors: {
  //   origin: '*',
  // },
  // transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  handleConnection(client: any, ...args: any[]) {
    // const token = client.handshake.auth.token;
    // // Handle WebSocket connection
    console.log('WebSocket client connected');
  }
  handleDisconnect(client: any) {
    // Handle WebSocket disconnection
    console.log('WebSocket client disconnected');
  }

  @SubscribeMessage('user:subscribe')
  async subscribeUser(
    @ConnectedSocket() client: Socket,
    @CurrentUser() user: User,
  ) {
    // login for on joining connection
    console.log(`User ${user.firstName} joined the chat server`);

    client.join(`user_${user.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() payload: any, @CurrentUser() user: User) {
    try {
      let message = new TextDecoder().decode(payload);
      message = JSON.parse(message);

      const conversationID = message['conversationID'];

      const conversation = await this.chatService.isValidConversation(
        conversationID,
      );

      // save message
      const newMessage = await this.messageService.createMessage({
        conversationID,
        message: message['message'],
        senderID: user.id,
      });

      // update last message & timestamp for conversation
      await this.chatService.updateConversationById(conversationID, {
        lastMessageID: newMessage._id,
        lastUpdated: new Date(),
      });

      // filter other user
      const receiver = conversation.participants.filter((i) => i !== user.id);
      if (receiver.length < 1) return false;

      const encodedNewMessage = new TextEncoder().encode(
        JSON.stringify(newMessage),
      );
      // send back to socket joined connection
      this.server.to(`user_${user.id}`).emit('message:sent', encodedNewMessage); // feedback to sender
      // emit mesg to receiver
      this.server
        .to(`user_${receiver[0]}`)
        .emit('message:new', encodedNewMessage);
    } catch (error) {
      //
      console.log(error);
      console.log('message operation failed');
    }
  }
}
