import {
  IsIn,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsEmpty,
} from 'class-validator';
import { USER_ROLE } from '../role.user.enum';

class BaseUserDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  mobileNo: string;

  @IsNotEmpty()
  @IsString()
  dob: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([USER_ROLE.SEEKER, USER_ROLE.PROVIDER])
  role: string;

  @IsOptional()
  token: object;
}

export class UserDTO extends BaseUserDTO {
  @IsOptional()
  @IsBoolean()
  isExperienced?: boolean;

  @IsOptional()
  @IsString()
  organization?: string;
}

export class UserSeekerDTO extends BaseUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsIn([USER_ROLE.SEEKER])
  role: string;

  @IsOptional()
  @IsEmpty({ message: 'organization is not allowed' })
  organization?: never;

  @IsBoolean()
  isExperienced: boolean;
}

export class UserProviderDTO extends BaseUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsIn([USER_ROLE.PROVIDER])
  role: string;

  @IsOptional()
  @IsEmpty({ message: 'isExperienced is not allowed' })
  isExperienced?: never;

  @IsNotEmpty()
  @IsString()
  organization: string;
}
