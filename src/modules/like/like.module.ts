import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LikeService } from './like.service';
import { likeController } from './like.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './schemas/likeSchema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  controllers: [likeController],
  providers: [LikeService],
})
export class LikeModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {
    console.log('middleware');
  }
}
