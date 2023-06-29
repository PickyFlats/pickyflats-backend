/* eslint-disable @typescript-eslint/ban-types */
import { UnauthorizedException } from '@nestjs/common';
import { Server, ServerOptions } from 'socket.io';
import { ExternalSocketIoAdapter } from 'src/common/adapter/external-socket-io-adapter';

export class ChatIoAdapter extends ExternalSocketIoAdapter {
  createIOServer(port: number, options?: ServerOptions) {
    const serverOptions = {
      ...options,
      // path: '/chatIO',
    };
    const server = super.createIOServer(port, serverOptions) as Server;

    server.use((socket, next) => {
      // socket.handshake.address = getAddress(socket);
      const authHeader = socket.handshake.headers['authorization'];
      if (!authHeader) {
        next(new UnauthorizedException('Invalid connection attempt!'));
      }

      // const token = authHeader?.replace('Bearer ', '');

      // if (token) {
      //   const decodedToken = this.jwtService.decode(token);
      //   if (decodedToken && typeof decodedToken === 'object') {
      //     const { sub, name, email, roles } = decodedToken;
      //     req.user = { sub, name, email, roles }; // Assuming the 'sub' property represents the user ID
      //   }
      // }

      next();
    });

    return server;
  }
}
