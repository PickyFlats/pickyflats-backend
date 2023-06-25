import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.$id = ret._id;
      delete ret._id;
    },
  },
  toObject: {
    transform: (doc, ret) => {
      ret.$id = ret._id;
      delete ret._id;
    },
  },
})
export class Conversation {
  //   @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  //   participants: Types.ObjectId[];
  @Prop({ type: [String], ref: 'User', required: true })
  participants: string[];

  @Prop()
  lastUpdated: Date;

  @Prop({ type: Types.ObjectId, ref: 'Message', default: null })
  lastMessage: Types.ObjectId;

  @Prop()
  chatStarter: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
