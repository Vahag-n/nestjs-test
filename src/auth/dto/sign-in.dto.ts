import { IsNotEmpty, IsEmail } from 'class-validator';

export class SignInUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
