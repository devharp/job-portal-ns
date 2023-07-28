import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobPostDto } from '../../constants/dto/create-job-post.dto';
import { JobPost } from 'src/schema/job-post/provider.job-post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobCategory } from 'src/schema/job-post/job.category.schema';
import { JobTitle } from 'src/schema/job-post/job.title.schema';
import { category, titles } from '../../utilities/static.array';
@Injectable()
export class JobPostService {
  constructor(
    @InjectModel('JobPost') private JobPostModel: Model<JobPost>,
    @InjectModel('JobCategory') private JobCategoryModel: Model<JobCategory>,
    @InjectModel('JobTitle') private JobTitleModel: Model<JobTitle>,
  ) {}
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

  /**
   *
   * @service : filter services
   *
   */

  async suggestJobTitlesByCategory(categoryName: string): Promise<string[]> {
    const category = await this.JobCategoryModel.findOne({
      name: categoryName,
    }).exec();
    if (!category) return [];
    return (
      await this.JobTitleModel.find({
        category: category._id,
      }).exec()
    ).map((record) => record.title);
  }

  async fetchJobPostsByCategory(categoryName: string): Promise<JobPost[]> {
    const category = await this.JobCategoryModel.findOne({
      name: categoryName,
    }).exec();
    if (!category) return [];
    return this.JobPostModel.find({ category: category._id }).exec();
  }

  async fetchJobPostsByJobTitle(jobTitleName: string): Promise<JobPost[]> {
    const jobTitle = await this.JobTitleModel.findOne({
      title: jobTitleName,
    }).exec();
    if (!jobTitle) return [];
    return this.JobPostModel.find({ jobTitle: jobTitle._id }).exec();
  }

  /**
   * @service : services to insert categories and titles : -
   * @NOTE:This services is for development/testing purposes only
   * and should not be used in production
   */

  async insertCategory() {
    try {
      await Promise.all(
        category.map(async (categ) => {
          const newCategory = new this.JobCategoryModel({ name: categ });
          await newCategory.save();
        }),
      );
      return 'insert done';
    } catch (error) {
      console.log('error during inserting category');
      throw error;
    }
  }

  async insertTitles() {
    try {
      for (const titleObj of titles) {
        const category = await this.JobCategoryModel.findOne({
          name: titleObj.category,
        }).exec();
        if (!category) {
          console.log(`Category not found for: ${titleObj.category}`);
          continue;
        }
        await Promise.all(
          titleObj.domain.map(async (title) => {
            const newTitle = new this.JobTitleModel({
              title,
              category: category._id,
            });
            await newTitle.save();
          }),
        );
      }
      return 'insert done';
    } catch (error) {
      console.error('Error inserting JobTitle data:', error);
      throw error;
    }
  }
}
