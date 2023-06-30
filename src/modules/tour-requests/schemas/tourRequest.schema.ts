import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, HydratedDocument, Types } from 'mongoose';

export type TourRequestDocument = HydratedDocument<TourRequest>;

type TourRequestStatus = 'draft' | 'accepted';

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.$id = ret._id;
    },
  },
  toObject: {
    transform: (doc, ret) => {
      ret.$id = ret._id;
    },
  },
})
export class TourRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Listing', required: true })
  listingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  pickedDate: string;

  @Prop()
  note: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  sellerId: Types.ObjectId;

  @Prop({ default: 'draft' })
  status: TourRequestStatus;
}

export const TourRequestSchema = SchemaFactory.createForClass(TourRequest);
