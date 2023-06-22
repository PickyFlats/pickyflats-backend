/* eslint-disable @typescript-eslint/no-namespace */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const decodedToken = this.jwtService.decode(token);
      if (decodedToken && typeof decodedToken === 'object') {
        const { userId, email, roles } = decodedToken;
        req.user = { userId, email, roles }; // Assuming the 'sub' property represents the user ID
      }
    }
    next();
  }
}

declare global {
  namespace Express {
    interface Request {
      // currentUser?: UserPayload;
      user?: any;
    }
  }
}
