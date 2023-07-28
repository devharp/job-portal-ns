import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobPostDto } from '../../constants/dto/create-job-post.dto';
import { User, UserSchemaClass } from 'src/schema/users/user.schema';
import { JobPost } from 'src/schema/job-post/provider.job-post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class JobPostService {
  constructor(
    @InjectModel('JobPost') private JobPostModel: Model<JobPost>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(createJobPostDto: CreateJobPostDto, provider: string) {
    const { _id } = await this.userModel.findById(provider);
    const postData = await this.JobPostModel.create({
      ...createJobPostDto,
      provider: _id,
    });
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
  async update(id: string, updateData: object): Promise<JobPost> {
    return this.JobPostModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).exec();
  }

  async delete(id: string): Promise<JobPost> {
    const result = await this.JobPostModel.findByIdAndDelete(id).exec();
    return result;
  }
  // find post by category
  async findJobPostsByCategory(categoryId: string): Promise<JobPost[]> {
    return this.JobPostModel.find({ category: categoryId })
      .populate('category')
      .exec();
  }
}
