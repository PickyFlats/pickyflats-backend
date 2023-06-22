import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { FileSchema } from 'src/modules/files/schemas/file.schema';

export type ListingDocument = HydratedDocument<Listing>;

@Schema({ versionKey: false })
export class Listing {
  @Prop()
  purpose: string;

  @Prop({ required: true })
  flatTypes: number[];

  @Prop({ required: true })
  buildingAmenities: string[];

  @Prop()
  flatAmenities: string[];

  @Prop()
  flatPolicies: string[];

  @Prop({ default: 0 })
  room: number;

  @Prop({ default: 0 })
  bathroom: number;

  @Prop({ default: 0 })
  kitchen: number;

  @Prop({ type: [{ type: FileSchema }] })
  gallery: File[];

  // sellerInfo
  @Prop()
  sellerCountry: string;
  @Prop()
  sellerCity: string;
  @Prop()
  sellerEmail: string;
  @Prop()
  sellerContact: string;

  // flat
  @Prop()
  flatCountry: string;
  @Prop()
  flatCity: string;
  @Prop()
  flatStreet1: string;
  @Prop()
  flatStreet2: string;
  @Prop()
  flatGeo: GLfloat[];

  // flat meta datas
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  listedBy: Types.ObjectId;
  @Prop()
  liked_by: string[];
  @Prop()
  saved_by: string[];
  @Prop({ default: false })
  isListed: boolean;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
