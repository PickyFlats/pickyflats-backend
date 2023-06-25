import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'Comment', required: true })
  Id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment', required: true })
  listingId: Types.ObjectId;

  @Prop()
  file: string[];

  @Prop()
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
