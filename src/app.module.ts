import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

import { config } from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';

config();

const DB_URI = process.env.MONGODB_URI || '';

@Module({
  imports: [MongooseModule.forRoot(DB_URI), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
