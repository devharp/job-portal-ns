import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateJobPostDto {
  @IsNotEmpty()
  @IsString()
  JobTitle: string;

  @IsNotEmpty()
  @IsString()
  OrganizationName: string;

  @IsNotEmpty()
  @IsString()
  jobDescription: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  salary: string;

  @IsNotEmpty()
  @IsString()
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
  @IsNumber()
  vacancies: number;

  @IsNotEmpty()
  @IsString()
  experienceLevel: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}
