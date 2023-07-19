// user.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { Document, HydratedDocument, Types } from 'mongoose';

export type UserProviderDocument = HydratedDocument<UserProvider>;

@Schema({ collection: 'provider' })
export class UserProvider extends Document {
  @Prop({ type: Types.ObjectId, ref: 'user' })
  user: Types.ObjectId;

  @Prop()
  organization: string;
}

@Exclude()
export class UserProviderSchemaClass {
  @Expose({ name: 'organization' })
  @IsString()
  organization: string;
}

export const UserProviderSchema = SchemaFactory.createForClass(UserProvider);
