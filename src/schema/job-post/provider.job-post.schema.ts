import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type JobPostDocument = HydratedDocument<JobPost>;

@Schema({ collection: 'job_post', timestamps: true })
export class JobPost extends Document {
  @Prop()
  JobTitle: string;

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

  @Prop()
  contactEmail: string;

  @Prop()
  contactPhone: string;

  @Prop()
  vacancies: number;

  @Prop()
  experienceLevel: string;

  // @Prop({ type: Types.ObjectId, ref: 'provider' })
  // provider: Types.ObjectId;

  @Prop()
  jobCategory: string;

  @Prop()
  status: string;
}
export const JobPostSchema = SchemaFactory.createForClass(JobPost);
