import { Module } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobPost,
  JobPostSchema,
} from 'src/schema/job-post/provider.job-post.schema';
import {
  JobCategorySchema,
  jobCategory,
} from 'src/schema/job-post/job.category.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: JobPost.name,
        schema: JobPostSchema,
      },
      {
        name: jobCategory.name,
        schema: JobCategorySchema,
      },
    ]),
  ],
  controllers: [JobPostController],
  providers: [JobPostService],
})
export class JobPostModule {}
