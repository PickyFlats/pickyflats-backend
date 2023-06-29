import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class commentMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    //!TODO: verify listing available or not before posting comment
    console.log('TODO: comment middleware');
    next();
  }
}
