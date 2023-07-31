import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { JobCategory as Category } from './job.category.schema';
import { JobTitle } from './job.title.schema';
import { User } from '../users/user.schema';

export type JobPostDocument = HydratedDocument<JobPost>;

@Schema({ collection: 'job_post', timestamps: true })
export class JobPost extends Document {
  @Prop()
  OrganizationName: string;

  @Prop()
  location: string;

  @Prop()
  jobDescription: string;

  @Prop([Number])
  salary: [number, number];

  @Prop()
  JobType: string;

  @Prop()
  postedDate: Date;

  @Prop()
  contactEmail: string;

  @Prop()
  vacancies: number;

  @Prop()
  experienceLevel: string;

  @Prop({ type: Types.ObjectId, ref: 'jobCategory' })
  category: Category;
  
  @Prop({ type: Types.ObjectId, ref: 'User' })
  provider: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'jobTitle' })
  jobTitle: JobTitle;

  @Prop()
  status: string;
}
export const JobPostSchema = SchemaFactory.createForClass(JobPost);
