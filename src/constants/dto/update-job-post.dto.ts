import {IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateJobPostDto {
  @IsOptional()
  @IsString()
  OrganizationName: string;

  @IsOptional()
  @IsString()
  jobDescription: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  salary: number[];

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
  JobCategory: string;

  @IsOptional()
  @IsString()
  Title: string;

  @IsOptional()
  @IsString()
  status: string;
}
