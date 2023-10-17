import { Injectable } from '@nestjs/common';
import { JobApplicationDto } from '../../constants/dto/job-application.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JobApplication } from 'src/schema/job-application/job-application.schema';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectModel('JobApplication') private JobApplicationModel: JobApplication,
  ) {}

  create(JobApplicationDto: JobApplicationDto) {
    return 'This action adds a new jobApplication';
  }

  findAll() {
    return `This action returns all jobApplication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobApplication`;
  }

  update(id: number, updateJobApplicationDto: any) {
    return `This action updates a #${id} jobApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobApplication`;
  }
}
