import { Module, forwardRef } from '@nestjs/common';
import { TourRequestsController } from './tour-requests.controller';
import { TourRequestsService } from './tour-requests.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TourRequest, TourRequestSchema } from './schemas/tourRequest.schema';
import { UsersModule } from '../users/users.module';
import { ListingsModule } from '../listings/listings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TourRequest.name, schema: TourRequestSchema },
    ]),
    forwardRef(() => AuthModule),
    UsersModule,
    ListingsModule,
  ],
  controllers: [TourRequestsController],
  providers: [TourRequestsService],
})
export class TourRequestsModule {}
