import { Injectable, NotFoundException } from '@nestjs/common';
import { Listing } from './schemas/listing.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    return this.listingsModel.create({
      ...data,
      listedBy: new Types.ObjectId(data.listedBy),
    });
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
          listedBy: new Types.ObjectId(userId),
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
          as: 'costs',
        },
      },
      {
        $addFields: {
          costs: {
            $arrayElemAt: ['$costs', 0],
          },
          $id: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
  }

  async getListingById(listingID) {
    const listing = await this.listingsModel.findById(listingID);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const costs = await this.listingCostsModel
      .findOne({
        listingID: new Types.ObjectId(listingID),
      })
      .select('-_id -listingID');
    return {
      ...listing.toJSON(),
      ...(costs ? { costs: costs.toJSON() } : {}),
    };
  }

  async deleteListingById(listingID) {
    await this.listingsModel.findByIdAndDelete(listingID);
    // !TODO: clean gallery images
    await this.listingCostsModel.deleteOne({
      listingID: new Types.ObjectId(listingID),
    });
  }
}
