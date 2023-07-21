import { IsNotEmpty, IsEmail } from 'class-validator';
export class mailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  text: string;
}
