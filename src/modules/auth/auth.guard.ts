import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No roles are specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false; // No token provided, access denied
    }

    try {
      const decoded = this.authService.verifyToken(token);
      const userRoles: string[] = decoded.roles;

      // Check if the user has any of the required roles
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role),
      );
      return hasRequiredRole;
    } catch (error) {
      return false; // Invalid token or verification failed, access denied
    }
  }
}
