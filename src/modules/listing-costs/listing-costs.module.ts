import { Module, forwardRef } from '@nestjs/common';
import { ListingCostsService } from './listing-costs.service';
import { ListingCostsController } from './listing-costs.controller';
import { ListingCost, ListingCostSchema } from './schemas/listingCost.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ListingCost.name, schema: ListingCostSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [ListingCostsService],
  controllers: [ListingCostsController],
  exports: [ListingCostsService],
})
export class ListingCostsModule {}
