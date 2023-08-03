import { Injectable } from '@nestjs/common';
import { JobApplicationDto } from '../../constants/dto/job-application.dto';

@Injectable()
export class JobApplicationService {
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
