import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { commentService } from './comment.service';
import { CommentController } from './comment.controller';
import { commentMiddleware } from './comment.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/commentSchema';
import { ProfilesModule } from '../profiles/profiles.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    UsersModule,
    ProfilesModule,
  ],
  controllers: [CommentController],
  providers: [commentService],
})
export class CommentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(commentMiddleware).forRoutes('comments');
  }
}
