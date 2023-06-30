import { Module, forwardRef } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Listing, ListingSchema } from './schemas/listing.schema';
import { ListingCostsModule } from '../listing-costs/listing-costs.module';
import { AuthModule } from '../auth/auth.module';
import {
  ListingCost,
  ListingCostSchema,
} from '../listing-costs/schemas/listingCost.schema';

@Module({
  imports: [
    ListingCostsModule,
    MongooseModule.forFeature([{ name: Listing.name, schema: ListingSchema }]),
    MongooseModule.forFeature([
      { name: ListingCost.name, schema: ListingCostSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [ListingsService],
  controllers: [ListingsController],
  exports: [ListingsService],
})
export class ListingsModule {}
