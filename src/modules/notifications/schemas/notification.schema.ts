import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

type NotificationType =
  | 'like'
  | 'tour_requested'
  | 'tour_accepted'
  | 'commented';

@Schema({ versionKey: false, timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  type: NotificationType;

  @Prop({ type: Types.ObjectId, ref: 'Listing', required: true })
  listingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment', required: true })
  commentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  likedUserId: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
