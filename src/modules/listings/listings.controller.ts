import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingDto } from './dto/listing.dto';
import { ListingCostsService } from '../listing-costs/listing-costs.service';

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

  @Post(['/new'])
  async createListing(@Res() response, @Body() listingDto: ListingDto) {
    try {
      const newListing = await this.listingsService.createListing(listingDto);
      return response.json({ created: true });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }

  // save/create listing costs by listingID
}
