import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.getStatus() === 403) {
      response.status(403).json({
        statusCode: 403,
        message: 'You are not authorized to access this resource.',
        error: 'Forbidden',
      });
    } else {
      response.status(exception.getStatus()).json(exception.getResponse());
    }
  }
}
