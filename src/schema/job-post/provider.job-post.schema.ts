import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { JobTitle } from './job.title.schema';
import { User } from '../users/user.schema';

export type JobPostDocument = HydratedDocument<JobPost>;

@Schema({ collection: 'job-post', timestamps: true })
export class JobPost extends Document {
  @Prop()
  OrganizationName: string;

  @Prop()
  location: string;

  @Prop()
  jobDescription: string;

  @Prop({
    type: {
      min: { type: Number, required: false },
      max: { type: Number, required: false },
      _id: false,
    },
    default: null,
  })
  salary?: { min: number; max: number };

  @Prop()
  jobType: string;

  @Prop()
  contactEmail: string;

  @Prop()
  vacancies: number;

  @Prop()
  experienceLevel: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  provider: User;

  @Prop({ type: Types.ObjectId, ref: 'JobTitle' })
  jobTitle: JobTitle;

  @Prop({ default: 'active' })
  status: string;
}
export const JobPostSchema = SchemaFactory.createForClass(JobPost);
