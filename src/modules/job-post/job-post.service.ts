import { Injectable } from '@nestjs/common';
import { CreateJobPostDto } from '../../constants/dto/create-job-post.dto';
import { UpdateJobPostDto } from '../../constants/dto/update-job-post.dto';
import { JobPost } from 'src/schema/job-post/provider.job-post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class JobPostService {
  constructor(@InjectModel('JobPost') private JobPostModel: Model<JobPost>) {}
  async create(createJobPostDto: CreateJobPostDto) {
    const postData = await this.JobPostModel.create(createJobPostDto);
    return postData;
  }

  async findAll(): Promise<JobPost[]> {
    const result = await this.JobPostModel.find().exec();
    return result;
  }

  async findById(id: number): Promise<JobPost> {
    const result = await this.JobPostModel.findById(id).exec();
    return result;
  }
  async update(id: string, JobPost: object): Promise<JobPost> {
    return this.JobPostModel.findByIdAndUpdate(id, JobPost, {
      new: true,
    }).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} jobPost`;
  }
}
