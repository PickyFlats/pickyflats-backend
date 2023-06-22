import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema({ versionKey: false })
export class File {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  path: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
