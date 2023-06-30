import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Listing', required: true })
  listingId: Types.ObjectId;

  @Prop()
  file: string[];

  @Prop()
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
