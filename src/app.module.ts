import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

import { config } from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';

config();

const DB_URI = process.env.MONGODB_URI || '';

@Module({
  imports: [
    MongooseModule.forRoot(DB_URI),
    UsersModule, // Import the UsersModule first for auth module
    AuthModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
