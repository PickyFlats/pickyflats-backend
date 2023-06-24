import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingDto } from './dto/listing.dto';
import { ListingCostsService } from '../listing-costs/listing-costs.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly listingCostService: ListingCostsService,
  ) {}

  @Get(['/'])
  async getListedListings(@Res() response) {
    try {
      const listings = await this.listingsService.getListings();
      return response.json(listings);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  // get current user listings
  @Get(['/me'])
  @UseGuards(AuthGuard)
  async currentUser(@Request() req, @Res() response) {
    const userId = req.user?.sub;

    const listings = await this.listingsService.getListingsByUserId(userId);

    return response.json(listings);
  }

  @Get(['/:listingID'])
  async getListingById(@Res() response, @Param('listingID') listingID: string) {
    try {
      const listing = await this.listingsService.getListingById(listingID);
      return response.json(listing);
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Post(['/new'])
  @UseGuards(AuthGuard)
  async createListing(
    @Request() req,
    @Res() response,
    @Body() listingDto: ListingDto,
  ) {
    try {
      const userId = req.user?.sub;
      const newListing = await this.listingsService.createListing({
        ...listingDto,
        listedBy: userId,
      });
      return response.json({ id: newListing.id });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Patch(['/:id'])
  @UseGuards(AuthGuard)
  async updateListing(
    @Request() req,
    @Res() response,
    @Param('id') listingID: string,
    @Body() listingDto: ListingDto,
  ) {
    try {
      const userId = req.user?.sub;
      // !TODO: ignore listing update if owner is diff
      await this.listingsService.updateListingById(listingID, listingDto);
      response.end();
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  @Delete(['/:id'])
  @UseGuards(AuthGuard)
  async deleteListingById(@Res() response, @Param('id') listingID: string) {
    try {
      await this.listingsService.deleteListingById(listingID);
      response.end();
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }
}
