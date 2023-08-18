import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  mobileNo: string;

  @IsString()
  dob: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsString()
  gender: string;

  @IsString()
  address: string;

  @IsString()
  availabilityToJoin: string;

  @IsString()
  profileSummary: string;

  @IsString()
  '10th': string;

  @IsString()
  '12th': string;

  @IsString()
  highestQualification: string;

  @IsString()
  stream: string;

  @IsString()
  percentage: string;

  @IsString()
  university: string;

  @IsOptional()
  @IsString()
  resume: string;
}
