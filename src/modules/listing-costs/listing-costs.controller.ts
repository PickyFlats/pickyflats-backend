import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ListingCostsService } from './listing-costs.service';
import { ListingCostDto } from './dto/listingCost.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('listing-costs')
export class ListingCostsController {
  constructor(private readonly listingCostService: ListingCostsService) {}

  @Post(['/new'])
  @UseGuards(AuthGuard)
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

  @Patch(['/listing/:listingID'])
  @UseGuards(AuthGuard)
  async updateListingCostsByListingID(
    @Request() req,
    @Res() response,
    @Param('listingID') listingID: string,
    @Body() listingCostDto: ListingCostDto,
  ) {
    try {
      // !TODO: ignore listing update if owner is diff
      await this.listingCostService.updateCostsByListingID(
        listingID,
        listingCostDto,
      );
      response.end();
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 401,
        message: err.message,
      });
    }
  }
}
