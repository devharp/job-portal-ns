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
    const { Title } = createJobPostDto;
    const title = await this.findIdOfCategoryOrTitle('title', Title);
    const { _id } = await this.userService.findById(provider);
    const postData = await this.JobPostModel.create({
      ...createJobPostDto,
      provider: _id,
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
      const { Title } = updateJobPostDto;
      const title = await this.findIdOfCategoryOrTitle('title', Title);
      const result = await this.JobPostModel.findByIdAndUpdate(
        id,
        {
          ...updateJobPostDto,
          jobTitle: title[0],
        },
        {
          new: true,
        },
      ).exec();
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

  async jobPostsHistory(
    providerId: string,
    status?: string,
    page: number = 1,
    perPage: number = 10,
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
}
