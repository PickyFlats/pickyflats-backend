import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

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
export class Message {
  //   @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  @Prop({ required: true })
  conversationID: string;

  @Prop({ required: true })
  senderID: string;

  @Prop()
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  isDelivered: boolean;

  @Prop({ type: [String], default: [] })
  attachments: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
