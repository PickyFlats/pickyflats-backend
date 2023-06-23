import { Injectable } from '@nestjs/common';
import { Listing } from './schemas/listing.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListingDto } from './dto/listing.dto';
import { ListingCost } from '../listing-costs/schemas/listingCost.schema';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private readonly listingsModel: Model<Listing>,
    @InjectModel(ListingCost.name)
    private readonly listingCostsModel: Model<ListingCost>,
  ) {}

  async createListing(data: ListingDto) {
    return this.listingsModel.create(data);
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

  async getListingsByUserId(userId) {
    // return this.listingsModel.find({ listedBy: userId });
    return this.listingsModel.aggregate([
      {
        $match: {
          listedBy: userId,
        },
      },
      {
        $lookup: {
          from: this.listingCostsModel.collection.name, // The name of the ListingCost collection
          localField: '_id',
          foreignField: 'listingID',
          pipeline: [
            {
              $project: {
                _id: 0,
                listingID: 0,
                //currency: 1
              },
            },
          ],
          as: 'listingCost',
        },
      },
      {
        $addFields: {
          listingCost: {
            $arrayElemAt: ['$listingCost', 0],
          },
        },
      },
    ]);
  }
}
