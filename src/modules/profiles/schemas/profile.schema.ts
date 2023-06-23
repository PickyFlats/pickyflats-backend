import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ versionKey: false })
export class Profile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: null })
  profilePicture: string;

  @Prop({ default: false })
  profileVerified: boolean;

  @Prop()
  personalInterests: string[];

  @Prop()
  referredSources: string[];

  @Prop()
  phoneNumber: string;

  @Prop()
  country: string;

  @Prop()
  city: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
