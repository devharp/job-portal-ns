// user.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { Document, HydratedDocument } from 'mongoose';

export type UserSeekerDocument = HydratedDocument<UserSeeker>;

@Schema({ collection: 'seeker' })
export class UserSeeker extends Document {
  @Prop()
  isExperienced: boolean;
}

@Exclude()
export class UserSeekerSchemaClass {
  @Expose({ name: 'isExperienced' })
  @IsBoolean()
  isExperienced: boolean;
}

export const UserSeekerSchema = SchemaFactory.createForClass(UserSeeker);
