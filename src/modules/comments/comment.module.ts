import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { commentService } from './comment.service';
import { CommentController } from './comment.controller';
import { commentMiddleware } from './comment.middleware';

@Module({
  imports: [],
  controllers: [CommentController],
  providers: [commentService],
})
export class CommentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(commentMiddleware).forRoutes('comment');
  }
}
