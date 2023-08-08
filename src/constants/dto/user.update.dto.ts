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
}
