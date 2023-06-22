import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ListingCostsService } from './listing-costs.service';
import { ListingCostDto } from './dto/listingCost.dto';

@Controller('listing-costs')
export class ListingCostsController {
  constructor(private readonly listingCostService: ListingCostsService) {}

  @Post(['/new'])
  async createListing(@Res() response, @Body() listingCostDto: ListingCostDto) {
    try {
      await this.listingCostService.saveListingCost(
        listingCostDto.listingID,
        listingCostDto,
      );
      return response.json({ created: true });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }
}
