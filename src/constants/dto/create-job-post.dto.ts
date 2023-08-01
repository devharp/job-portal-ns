import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateJobPostDto {
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
  salary: number[];

  @IsNotEmpty()
  @IsString()
  JobType: string;

  @IsNotEmpty()
  @IsString()
  contactEmail: string;

  @IsNotEmpty()
  @IsNumber()
  vacancies: number;

  @IsNotEmpty()
  @IsNumber()
  experienceLevel: number;

  @IsNotEmpty()
  @IsString()
  JobCategory: string;

  @IsNotEmpty()
  @IsString()
  Title: string;
}
