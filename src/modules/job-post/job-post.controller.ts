import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Res,
  Request,
  NotFoundException,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPost } from 'src/schema/job-post/provider.job-post.schema';
import { Request as Req } from 'express';
import { CreateJobPostDto } from '../../constants/dto/create-job-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validate } from 'class-validator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { globalValidationPipe } from 'src/pipes/global-validation.pipe';
import { UpdateJobPostDto } from 'src/constants/dto/update-job-post.dto';
import { throwError } from 'rxjs';
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller('job-post')
export class JobPostController {
  constructor(
    private readonly jobPostService: JobPostService,
    @InjectModel(JobPost.name) private JobPostModel: Model<JobPost>,
  ) {}
  @Roles('provider')
  @Post()
  async create(
    @Body(globalValidationPipe) createJobPostDto: CreateJobPostDto,
    @Request() req: any,
  ) {
    const provider: string = req.user.id;
    const result = await this.jobPostService.create(createJobPostDto, provider);
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
  @Roles('provider')
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body(globalValidationPipe)
    updateJobPostDto: UpdateJobPostDto,
  ): Promise<JobPost> {
    const result = await this.jobPostService.update(id, updateJobPostDto);
    if (!result) {
      throw new NotFoundException(`Job post with ID not found `);
    }
    return result;
  }
  @Roles('provider')
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

  /**
   * @routes : filter routes
   *
   */
  @Get('suggestions/dropdown')
  async getSuggestionsByCategory(@Query('category') category: string) {
    return await this.jobPostService.suggest(category);
  }
  @Get('history/posts')
  async getProvidersPost(
    @Request() req: any,
    @Query('status') status: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ) {
    if (status && status !== 'active' && status !== 'inactive') {
      throw new HttpException(
        'Invalid status parameter',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.jobPostService.jobPostsHistory(
      req.user.id,
      status,
      from,
      to,
      page,
      perPage,
    );
  }
}
