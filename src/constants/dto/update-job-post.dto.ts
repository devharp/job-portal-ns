import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateJobPostDto {
  @IsOptional()
  @IsString()
  organizationName: string;

  @IsOptional()
  @IsString()
  jobDescription: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  salary: object | null;

  @IsOptional()
  @IsString()
  JobType: string;

  @IsOptional()
  @IsString()
  contactEmail: string;

  @IsOptional()
  @IsNumber()
  vacancies: number;

  @IsOptional()
  @IsNumber()
  experienceLevel: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  status: string;
}
