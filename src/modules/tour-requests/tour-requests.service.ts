import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TourRequest } from './schemas/tourRequest.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { ListingsService } from '../listings/listings.service';

@Injectable()
export class TourRequestsService {
  constructor(
    @InjectModel(TourRequest.name)
    private readonly tourRequestModel: Model<TourRequest>,
    private readonly usersService: UsersService,
    private readonly listingsService: ListingsService,
  ) {}

  async createRequestForTour(data) {
    return this.tourRequestModel.create(data);
  }

  async getTourRequestsForSeller(sellerId) {
    const tourRequests = await this.tourRequestModel.find({ sellerId });

    // filter out ids for listings, userIds & fetch listings and users
    const listingIDs = [
      ...new Set(tourRequests.flatMap((res) => res.listingId.toString())),
    ];
    const listings = await this.listingsService.getListingsByIds(listingIDs);

    const userIDs = [
      ...new Set(tourRequests.flatMap((res) => res.userId.toString())),
    ];
    const userProfiles = await this.usersService.getUsersWithProfiles(userIDs);

    const requestsWithListingsAndProfiles = tourRequests.map((tour) => {
      const listing = listings
        .find((l) => l.id === tour.listingId.toString())
        ?.toJSON();
      const userProfile = userProfiles.find(
        (u) => u.userId.toString() === tour.userId.toString(),
      );
      return { ...tour.toJSON(), listing, user: userProfile };
    });

    return requestsWithListingsAndProfiles;
  }

  async updateTourRequestById(id, update) {
    return this.tourRequestModel.findByIdAndUpdate(id, { $set: update });
  }
}
