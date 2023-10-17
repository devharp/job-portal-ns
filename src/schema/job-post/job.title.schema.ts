import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { JobCategory as Category, JobCategory } from './job.category.schema';
export type JobTitleDocument = HydratedDocument<JobTitle>;

@Schema({ collection: 'jobTitle', timestamps: true })
export class JobTitle extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'JobCategory' })
  category: JobCategory;
}
export const JobTitleSchema = SchemaFactory.createForClass(JobTitle);
