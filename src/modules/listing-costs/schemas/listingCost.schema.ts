import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Listing } from 'src/modules/listings/schemas/listing.schema';

export type ListingCostDocument = HydratedDocument<ListingCost>;

@Schema({ versionKey: false })
export class ListingCost {
  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  negotiable: string;

  @Prop()
  purchaseCost: number;

  @Prop()
  monthlyCost: number;

  @Prop()
  yearlyCost: number;

  @Prop()
  mortgagePayments: number;

  @Prop()
  utilityCost: number;

  @Prop()
  insuranceCost: number;

  @Prop()
  propertyTax: number;

  @Prop()
  internetCost: number;

  @Prop()
  parkingFee: number;

  @Prop()
  petFee: number;

  @Prop()
  communalFacilityFee: number;

  @Prop()
  cleaningFee: number;

  @Prop()
  homeImprovement: number;

  @Prop()
  furnitureAppliances: number;

  @Prop()
  legalFees: number;

  @Prop()
  movingCost: number;

  @Prop()
  securitySystem: number;

  @Prop()
  homeOfficeSetup: number;

  @Prop()
  maintenanceRepairs: number;

  @Prop()
  otherCost: number;

  @Prop({ type: Types.ObjectId, ref: Listing.name, required: true })
  listingID: Types.ObjectId;
}

export const ListingCostSchema = SchemaFactory.createForClass(ListingCost);
