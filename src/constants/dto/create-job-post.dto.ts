import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateJobPostDto {
  @IsNotEmpty()
  @IsString()
  Jobtitle: string;

  @IsNotEmpty()
  @IsString()
  OrganizationName: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  salary: string;

  @IsNotEmpty()
  @IsString()
  @IsDateString()
  JobType: string;

  @IsNotEmpty()
  @IsString()
  jobCategory: string;

  @IsNotEmpty()
  @IsString()
  postedDate: string;

  @IsNotEmpty()
  @IsString()
  contactEmail: string;

  @IsNotEmpty()
  @IsString()
  contactPhone: string;

  @IsNotEmpty()
  @IsString()
  vacancies: string;

  @IsNotEmpty()
  @IsString()
  experienceLevel: string;
}
