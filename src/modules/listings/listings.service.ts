import { Injectable } from '@nestjs/common';
import { Listing } from './schemas/listing.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListingDto } from './dto/listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private readonly listingsModel: Model<Listing>,
  ) {}

  async createListing(data: ListingDto) {
    await this.listingsModel.create(data);
  }

  async updateListingById(listingId, update: Partial<Listing>) {
    await this.listingsModel.findByIdAndUpdate(listingId, { $set: update });
  }

  async findListingById(listingId) {
    return await this.listingsModel.findById(listingId);
  }

  async getListings() {
    return this.listingsModel.find();
  }
}
