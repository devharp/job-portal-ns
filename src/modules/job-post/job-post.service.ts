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
import { UserRegistrationService } from '../user-registration/user-registration.service';
import { EncryptionService } from 'src/utilities/encryption.service';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateJobPostDto } from 'src/constants/dto/update-job-post.dto';
import { Helper } from 'src/utilities/helper.service';
@Injectable()
export class JobPostService {
  constructor(
    @InjectModel('JobPost') private JobPostModel: PaginateModel<JobPost>,
    @InjectModel('JobCategory') private JobCategoryModel: Model<JobCategory>,
    @InjectModel('JobTitle') private JobTitleModel: Model<JobTitle>,
    private userService: UserRegistrationService,
    private encryptionService: EncryptionService,
    private helperService: Helper,
  ) {}
  async create(createJobPostDto: CreateJobPostDto, provider: string) {
    const { title } = createJobPostDto;
    const Title = await this.findIdOfCategoryOrTitle('title', title);
    const { _id } = await this.userService.findById(provider);
    const postData = await this.JobPostModel.create({
      ...createJobPostDto,
      provider: _id,
      jobTitle: Title[0],
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
      const { title, status } = updateJobPostDto;
      let updateData = {};
      if (title) {
        const Title = await this.findIdOfCategoryOrTitle('title', title);
        updateData = {
          ...updateJobPostDto,
          jobTitle: Title[0],
        };
      } else if (status) {
        updateData = {
          status: status,
        };
      } else {
        throw new Error('No update data provided.');
      }

      const result = await this.JobPostModel.findByIdAndUpdate(id, updateData, {
        new: true,
      }).exec();
      return result;
    } catch (error) {
      return error.message;
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
  // provider:- view history
  async jobPostsHistory(
    providerId: string,
    status?: string,
    from?: string,
    to?: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<PaginateResult<JobPost>> {
    try {
      const { _id } = await this.userService.findById(providerId);
      const query: any = status ? { provider: _id, status } : { provider: _id };
      if (from && to) {
        query.postedOn = {
          $gte: new Date(from).toISOString().split('T')[0],
          $lte: new Date(to).toISOString().split('T')[0],
        };
      }
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
              HttpStatus.CONFLICT,
            ),
          );
    } catch (error) {
      throw new HttpException(
        'Failed to fetch job post history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
