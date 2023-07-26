import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type JobPostDocument = HydratedDocument<jobCategory>;

@Schema({ collection: 'JobCategory', timestamps: true })
export class jobCategory extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;
}
export const JobCategorySchema = SchemaFactory.createForClass(jobCategory);
