import { Module } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
  JobPost,
  JobPostSchema,
} from 'src/schema/job-post/provider.job-post.schema';
import {
  JobCategorySchema,
  JobCategory,
} from 'src/schema/job-post/job.category.schema';
import { JobTitle, JobTitleSchema } from 'src/schema/job-post/job.title.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: JobPost.name,
        schema: JobPostSchema,
      },
      {
        name: JobCategory.name,
        schema: JobCategorySchema,
      },
      {
        name: JobTitle.name,
        schema: JobTitleSchema,
      },
    ]),
    JwtModule.register({
      secret: 'your_secret_key_here',
      signOptions: { expiresIn: '1d' }, // Token expiration time (optional)
    }),
  ],
  controllers: [JobPostController],
  providers: [JobPostService],
})
export class JobPostModule {}
