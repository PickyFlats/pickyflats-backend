import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Client, getClient } from 'src/shared/utils/get-client';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { Socket } from 'socket.io';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const request = context.switchToHttp().getRequest();
    const client = getClient(context);

    // TODO: check for roles using websockets
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    try {
      client.user = await this.handleRequest(context, client);

      if (!requiredRoles) {
        return true; // No roles are specified, allow access
      }

      const userRoles: string[] = client.user.roles;
      // Check if the user has any of the required roles
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role),
      );
      return hasRequiredRole;
    } catch (error) {
      this.throwException(context, 'Invalid token');
    }
  }

  private async handleRequest(ctx: ExecutionContext, client: Client) {
    const token = client.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
      // No token provided, access denied
    }

    const decoded = this.authService.verifyToken(token);

    if (!decoded) {
      this.throwException(ctx, 'Invalid auth token');
    }

    try {
      const user = await this.validate(decoded);

      // !ASYNC TOKEN Verification

      return user;
    } catch (e) {
      this.throwException(ctx, 'Invalid token');
    }
  }

  throwException(ctx: ExecutionContext, message: string) {
    if (ctx.getType() === 'ws') {
      ctx.switchToWs().getClient<Socket>().disconnect(true);
    }

    throw new UnauthorizedException(message);
  }

  private validate({ sub }: JwtPayload) {
    return this.usersService.validateUserById(sub);
  }
}
