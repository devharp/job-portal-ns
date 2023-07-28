import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type JobCategoryDocument = HydratedDocument<JobCategory>;

@Schema({ collection: 'jobCategory', timestamps: true })
export class JobCategory extends Document {
  @Prop({ required: true })
  name: string;
}
export const JobCategorySchema = SchemaFactory.createForClass(JobCategory);
