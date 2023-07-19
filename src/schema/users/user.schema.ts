import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document, HydratedDocument } from 'mongoose';
import { USER_ROLE } from 'src/constants/role.user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user' })
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  mobileNo: string;

  @Prop()
  dob: string;

  @Prop({ enum: USER_ROLE, default: USER_ROLE.SEEKER })
  role: string;
}

@Exclude()
export class UserSchemaClass {
  @Expose({ name: 'firstName' })
  firstName: string;

  @Expose({ name: 'lastName' })
  lastName: string;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'password' })
  password: string;

  @Expose({ name: 'mobileNo' })
  mobileNo: string;

  @Expose({ name: 'dob' })
  dob: string;

  @Expose({ name: 'role' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
