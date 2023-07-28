import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { JobCategory as Category } from './job.category.schema';
import { JobTitle } from './job.title.schema';

export type JobPostDocument = HydratedDocument<JobPost>;

@Schema({ collection: 'job_post', timestamps: true })
export class JobPost extends Document {
  @Prop()
  OrganizationName: string;

  @Prop()
  location: string;

  @Prop()
  jobDescription: string;

  @Prop()
  salary: string;

  @Prop()
  JobType: string;

  @Prop()
  postedDate: Date;

  @Prop({ unique: true })
  contactEmail: string;

  @Prop({ unique: true })
  contactPhone: string;

  @Prop()
  vacancies: number;

  @Prop()
  experienceLevel: string;

  @Prop({ type: Types.ObjectId, ref: 'jobCategory', required: true })
  category: Category;

  @Prop({ type: Types.ObjectId, ref: 'jobTitle', required: true })
  jobTitle: JobTitle;

  @Prop()
  status: string;
}
export const JobPostSchema = SchemaFactory.createForClass(JobPost);
