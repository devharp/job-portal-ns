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
  OrganizationName: string;

  @IsNotEmpty()
  @IsString()
  jobDescription: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
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
  @IsString()
  experienceLevel: string;

  @IsNotEmpty()
  @IsString()
  jobCategory: string; // category

  @IsNotEmpty()
  @IsString()
  Title: string; // title

  @IsNotEmpty()
  @IsString()
  status: string;
}
