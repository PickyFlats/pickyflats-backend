import { Injectable } from '@nestjs/common';
import { ListingCost } from './schemas/listingCost.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ListingCostDto } from './dto/listingCost.dto';

@Injectable()
export class ListingCostsService {
  constructor(
    @InjectModel(ListingCost.name)
    private readonly listingCostModel: Model<ListingCost>,
  ) {}

  async saveListingCost(listingID, data: ListingCostDto) {
    let cost = await this.listingCostModel.findOne({ listingID });
    if (!cost) {
      cost = await this.listingCostModel.create({
        ...data,
        listingID: new Types.ObjectId(listingID),
      });
    }
    // return cost;
  }

  async getListingCostByListingID(listingID) {
    return this.listingCostModel.findOne({ listingID });
  }

  async updateCostsByListingID(listingID, data: ListingCostDto) {
    return this.listingCostModel.findOneAndUpdate(
      { listingID },
      { $set: data },
    );
  }
}
