import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from '../../constants/dto/create-job-post.dto';
import { JobPost } from 'src/schema/job-post/provider.job-post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validate } from 'class-validator';
import { globalValidationPipe } from 'src/pipes/global-validation.pipe';
@Controller('job-post')
export class JobPostController {
  constructor(
    private readonly jobPostService: JobPostService,
    @InjectModel(JobPost.name) private JobPostModel: Model<JobPost>,
  ) {}

  @Post()
  create(@Body() createJobPostDto: CreateJobPostDto) {
    return this.jobPostService.create(createJobPostDto);
  }

  @Get()
  findAll() {
    return this.jobPostService.findAll();
  }

  @Get(':id')
  async getJobPostById(@Param('id') id: number): Promise<JobPost> {
    return await this.jobPostService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateData: JobPost,
  ): Promise<JobPost> {
    return await this.jobPostService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostService.remove(+id);
  }
}
