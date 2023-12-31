import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

class SalaryObject {
  @IsOptional()
  @IsNumber()
  @Min(0)
  min?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  max?: number;
}

export class CreateJobPostDto {
  @IsNotEmpty()
  @IsString()
  organizationName: string;

  @IsNotEmpty()
  @IsString()
  jobDescription: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  salary: object | null;

  @IsNotEmpty()
  @IsString()
  jobType: string;

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
  title: string;
}
