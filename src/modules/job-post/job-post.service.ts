import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobPostDto } from '../../constants/dto/create-job-post.dto';
import { User, UserSchemaClass } from 'src/schema/users/user.schema';
import { JobPost } from 'src/schema/job-post/provider.job-post.schema';
import { Model, PaginateResult, PaginateModel } from 'mongoose';
import { JobCategory } from 'src/schema/job-post/job.category.schema';
import { JobTitle } from 'src/schema/job-post/job.title.schema';
import { category, titles } from '../../utilities/static.array';
import { UserRegistrationService } from '../user-registration/user-registration.service';
import { EncryptionService } from 'src/utilities/encryption.service';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateJobPostDto } from 'src/constants/dto/update-job-post.dto';
@Injectable()
export class JobPostService {
  constructor(
    @InjectModel('JobPost') private JobPostModel: PaginateModel<JobPost>,
    @InjectModel('JobCategory') private JobCategoryModel: Model<JobCategory>,
    @InjectModel('JobTitle') private JobTitleModel: Model<JobTitle>,
    private userService: UserRegistrationService,
    private encryptionService: EncryptionService,
  ) {}
  async create(createJobPostDto: CreateJobPostDto, provider: string) {
    const { JobCategory, Title } = createJobPostDto;
    const category = await this.findIdOfCategoryOrTitle(
      'category',
      JobCategory,
    );
    const title = await this.findIdOfCategoryOrTitle('title', Title);
    const { _id } = await this.userService.findById(provider);
    const postData = await this.JobPostModel.create({
      ...createJobPostDto,
      provider: _id,
      category: category[0],
      jobTitle: title[0],
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

  async update(
    id: string,
    updateJobPostDto: UpdateJobPostDto,
  ): Promise<JobPost> {
    try {
      const { JobCategory, Title } = updateJobPostDto;
      const category = await this.findIdOfCategoryOrTitle(
        'category',
        JobCategory,
      );
      const title = await this.findIdOfCategoryOrTitle('title', Title);
      const result = await this.JobPostModel.findByIdAndUpdate(
        id,
        {
          ...updateJobPostDto,
          category: category[0],
          jobTitle: title[0],
        },
        {
          new: true,
        },
      ).exec();
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async delete(id: string): Promise<JobPost> {
    const result = await this.JobPostModel.findByIdAndDelete(id).exec();
    return result;
  }
  /**
   * @service : filter services : -
   *
   */

  async findIdOfCategoryOrTitle(of: string, name: string): Promise<any> {
    const results =
      of === 'category'
        ? await this.JobCategoryModel.find({
            name: { $regex: this.encryptionService.regexAppplication(name) },
          }).exec()
        : await this.JobTitleModel.find({
            title: { $regex: this.encryptionService.regexAppplication(name) },
          }).exec();
    return results ? results.map((result) => result._id) : [];
  }

  async suggest(categoryName: string): Promise<string[]> {
    const categoryId = await this.findIdOfCategoryOrTitle(
      'category',
      categoryName,
    );
    if (!categoryId) return [];
    return (
      await this.JobTitleModel.find({
        category: categoryId,
      }).exec()
    ).map((record) => record.title);
  }

  async jobPostsHistory(
    providerId: string,
    status?: string,
    page: number = 2,
    perPage: number = 2,
  ): Promise<PaginateResult<JobPost>> {
    try {
      const { _id } = await this.userService.findById(providerId);
      const query = status ? { provider: _id, status } : { provider: _id };
      const options = {
        sort: { createdAt: -1 },
        page: page,
        limit: perPage,
        populate: { path: 'jobTitle', select: '-_id title' },
      };
      const history = await this.JobPostModel.paginate(query, options);
      return history.docs.length !== 0
        ? history
        : Promise.reject(
            new HttpException(
              'No job posts found with the specified status',
              HttpStatus.NOT_FOUND,
            ),
          );
    } catch (error) {
      throw new HttpException(
        'Failed to fetch job post history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
      console.log('error during inserting category', error);

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
