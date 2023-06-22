import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Listing } from '../schemas/listing.schema';
export class ListingDto extends Listing {}
