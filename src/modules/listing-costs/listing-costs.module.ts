import { Module } from '@nestjs/common';
import { ListingCostsService } from './listing-costs.service';
import { ListingCostsController } from './listing-costs.controller';
import { ListingCost, ListingCostSchema } from './schemas/listingCost.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ListingCost.name, schema: ListingCostSchema },
    ]),
  ],
  providers: [ListingCostsService],
  controllers: [ListingCostsController],
  exports: [ListingCostsService],
})
export class ListingCostsModule {}
