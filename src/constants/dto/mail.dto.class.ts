import { IsNotEmpty, IsEmail } from 'class-validator';
export class resetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
