import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AccountType } from 'src/shared/user/account-type.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ required: false })
  roles: string[];

  @Prop({ required: false })
  accountType: AccountType;

  @Prop({ required: false })
  lastActivity: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
