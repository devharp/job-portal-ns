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
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
export class JobPostController {
  constructor(
    private readonly jobPostService: JobPostService,
    @InjectModel(JobPost.name) private JobPostModel: Model<JobPost>,
  ) {}
  @Roles('provider')
  @Post()
  async create(
    @Body(globalValidationPipe) CreateJobPostDto: any,
    @Request() req: any,
  ) {
    const provider: string = req.user.id;
    const result = await this.jobPostService.create(CreateJobPostDto, provider);
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
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateData: JobPost,
  ): Promise<JobPost> {
    return await this.jobPostService.update(id, updateData);
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
  async getProvidersPost(@Request() req: any, @Query('status') status: string) {
    if (status && status !== 'active' && status !== 'inactive') {
      throw new HttpException(
        'Invalid status parameter',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.jobPostService.jobPostsHistory(req.user.id, status);
  }
  /**
   * @routes : routes to insert categories and titles : -
   * @NOTE:This routes is for development/testing purposes only
   * and should not be used in production
   */

  @Post('add-category')
  async insertCategory() {
    return await this.jobPostService.insertCategory();
  }

  @Post('add-title')
  async insertTitle() {
    return await this.jobPostService.insertTitles();
  }
}
