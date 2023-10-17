import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  mobileNo: string;

  @IsOptional()
  @IsString()
  dob: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  availabilityToJoin: string;

  @IsOptional()
  @IsString()
  profileSummary: string;

  @IsOptional()
  @IsString()
  '10th': string;

  @IsOptional()
  @IsString()
  '12th': string;

  @IsOptional()
  @IsString()
  highestQualification: string;

  @IsOptional()
  @IsString()
  stream: string;

  @IsOptional()
  @IsString()
  percentage: string;

  @IsOptional()
  @IsString()
  university: string;

  @IsOptional()
  @IsString()
  resume: string;

  @IsOptional()
  @IsString()
  organization: string;
}
