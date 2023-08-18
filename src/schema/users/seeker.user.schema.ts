// user.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { Document, HydratedDocument, Types } from 'mongoose';

export type UserSeekerDocument = HydratedDocument<UserSeeker>;

@Schema({ collection: 'seeker' })
export class UserSeeker extends Document {
  @Prop({ type: Types.ObjectId, ref: 'user' })
  user: Types.ObjectId;

  @Prop()
  dob: string;

  @Prop()
  isExperienced: boolean;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop()
  availabilityToJoin: string;

  @Prop()
  profileSummary: string;

  @Prop()
  '10th': string;

  @Prop()
  '12th': string;

  @Prop()
  highestQualification: string;

  @Prop()
  percentage: String;

  @Prop()
  stream: string;

  @Prop()
  university: string;

  @Prop()
  resumeUrl: string;
}

@Exclude()
export class UserSeekerSchemaClass {
  @Expose({ name: 'isExperienced' })
  @IsBoolean()
  isExperienced: boolean;

  @Expose()
  dob: string;
}

export const UserSeekerSchema = SchemaFactory.createForClass(UserSeeker);
