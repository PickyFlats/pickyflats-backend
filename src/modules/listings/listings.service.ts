import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Listing } from './schemas/listing.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ListingDto } from './dto/listing.dto';
import { ListingCost } from '../listing-costs/schemas/listingCost.schema';
import { ListingCostsService } from '../listing-costs/listing-costs.service';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private readonly listingsModel: Model<Listing>,
    @InjectModel(ListingCost.name)
    private readonly listingCostsModel: Model<ListingCost>,
    private readonly listingCostService: ListingCostsService,
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
    return await this.listingsModel.find({ listingId: listingId });
  }

  async getListings() {
    const listings = await this.listingsModel.find({ isListed: true });

    const listingIDs = [...new Set(listings.flatMap((res) => res.id))];

    // find listing costs for listings
    const listingCosts =
      await this.listingCostService.getListingCostsDataByListingIds(listingIDs);

    const listingsWithCost = listings.map((listing) => {
      const costs = listingCosts
        .find((l) => l.listingID.toString() === listing._id.toString())
        ?.toJSON();
      return { ...listing.toJSON(), costs };
    });

    return listingsWithCost;
  }

  async getListingsByIds(ids: string[]) {
    const listings = await this.listingsModel.find({
      isListed: true,
      _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
    });
    return listings;
  }

  async getListingsByUserId(userId) {
    return this.listingsModel.find({ listedBy: new Types.ObjectId(userId) });
  }
  async getListingsWithCostByUserId(userId) {
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

  // search
  async getListingsByQuery(query) {
    const searchTerm = query?.q;
    if (searchTerm && searchTerm.length < 3) {
      throw new BadRequestException(
        'Please enter at least 3 characters to search for flats.',
      );
    }
    const listings = await this.listingsModel.find({
      ...(query?.q
        ? {
            $or: [
              { flatCountry: { $regex: searchTerm, $options: 'i' } },
              { flatCity: { $regex: searchTerm, $options: 'i' } },
              { flatStreet1: { $regex: searchTerm, $options: 'i' } },
              { flatStreet2: { $regex: searchTerm, $options: 'i' } },
            ],
          }
        : {}),
      isListed: true,
    });

    const listingIDs = [...new Set(listings.flatMap((res) => res.id))];

    // find listing costs for listings
    const listingCosts =
      await this.listingCostService.getListingCostsDataByListingIds(listingIDs);

    const listingsWithCost = listings.map((listing) => {
      const costs = listingCosts
        .find((l) => l.listingID.toString() === listing._id.toString())
        ?.toJSON();
      return { ...listing.toJSON(), costs };
    });

    return listingsWithCost;
  }
}
