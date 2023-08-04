import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { JobPost } from '../job-post/provider.job-post.schema';
import { User } from '../users/user.schema';

export type JobApplicationDocument = HydratedDocument<JobApplication>;

@Schema({ collection: 'job-application' })
export class JobApplication extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  seeker: User;

  @Prop({ type: Types.ObjectId, ref: 'JobPost' })
  jobPost: JobPost;

  @Prop()
  coverLetter: string;

  @Prop()
  expectedSalary: string;

  @Prop()
  availability: String;

  @Prop({ default: new Date() })
  appliedAt: Date;

  @Prop()
  resumeUrl: string;

  @Prop({ enum: ['reject', 'interview', 'hold'], default: 'hold' })
  status: string;
}

export const JobApplicationSchema =
  SchemaFactory.createForClass(JobApplication);
