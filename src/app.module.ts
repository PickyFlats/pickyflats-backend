import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { JwtMiddleware } from './common/middleware/jwt.middleware';
import { ListingsModule } from './modules/listings/listings.module';
import { ListingCostsModule } from './modules/listing-costs/listing-costs.module';
import { FilesModule } from './modules/files/files.module';
import { CommentModule } from './modules/comments/comment.module';
import { ChatModule } from './modules/chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { LikeModule } from './modules/like/like.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TourRequestsModule } from './modules/tour-requests/tour-requests.module';

const DB_URI = process.env.MONGODB_URI || '';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(DB_URI, { dbName: 'pickyflats_dev' }),
    FilesModule,
    UsersModule, // Import the UsersModule first for auth module
    ProfilesModule,
    AuthModule,
    ListingCostsModule,
    ListingsModule,
    CommentModule,
    ChatModule,
    LikeModule,
    NotificationsModule,
    TourRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
