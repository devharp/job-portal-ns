import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationDto } from '../../constants/dto/job-application.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('job-application')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post()
  create(@Body() createJobApplicationDto: JobApplicationDto) {
    return this.jobApplicationService.create(createJobApplicationDto);
  }

  @Get()
  findAll() {
    return this.jobApplicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobApplicationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobApplicationDto: any) {
    return this.jobApplicationService.update(+id, updateJobApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobApplicationService.remove(+id);
  }
}
