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
  jobCategory,
} from 'src/schema/job-post/job.category.schema';
import { User, UserSchema } from 'src/schema/users/user.schema';
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
      {
        name: User.name,
        schema: UserSchema,
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
