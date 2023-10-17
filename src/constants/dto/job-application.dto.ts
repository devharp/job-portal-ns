import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { JobPost } from '../../schema/job-post/provider.job-post.schema';
import { User } from '../../schema/users/user.schema';

export class JobApplicationDto {
  @IsNotEmpty()
  seeker: User;

  @IsNotEmpty()
  jobPost: JobPost;

  @IsOptional()
  @IsString()
  coverLetter: string;

  @IsOptional()
  @IsString()
  expectedSalary: string;

  @IsOptional()
  @IsString()
  availability: string; /* Imeadiate or 10-15 days */

  @IsNotEmpty()
  @IsString()
  resumeUrl: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}
