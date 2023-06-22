import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Listing, ListingSchema } from './schemas/listing.schema';
import { ListingCostsModule } from '../listing-costs/listing-costs.module';

@Module({
  imports: [
    ListingCostsModule,
    MongooseModule.forFeature([{ name: Listing.name, schema: ListingSchema }]),
  ],
  providers: [ListingsService],
  controllers: [ListingsController],
})
export class ListingsModule {}
