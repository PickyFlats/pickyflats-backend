import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ListingCost } from '../schemas/listingCost.schema';
export class ListingCostDto extends ListingCost {}
