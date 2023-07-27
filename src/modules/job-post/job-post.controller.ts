import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Res,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from '../../constants/dto/create-job-post.dto';
import { JobPost } from 'src/schema/job-post/provider.job-post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validate } from 'class-validator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { globalValidationPipe } from 'src/pipes/global-validation.pipe';
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles('provider')
@Controller('job-post')
export class JobPostController {
  constructor(
    private readonly jobPostService: JobPostService,
    @InjectModel(JobPost.name) private JobPostModel: Model<JobPost>,
  ) {}
  // @UseGuards(JwtAuthGuard)

  @Post()
  async create(@Body(globalValidationPipe) createJobPostDto: CreateJobPostDto) {
    const result = await this.jobPostService.create(createJobPostDto);
    return result;
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
  async remove(@Param('id') id: string, @Res() res) {
    const delPost = await this.jobPostService.delete(id);
    if (!delPost) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'id not found',
        result: delPost,
      });
    }
    return res
      .status(200)
      .json({ statusCode: 200, messagee: 'post deleted', id: delPost._id });
  }

  // get job-post by category
  @Get(':categoryId')
  async findJobPostsByCategory(@Param('categoryId') categoryId: string) {
    return this.jobPostService.findJobPostsByCategory(categoryId);
  }
}
