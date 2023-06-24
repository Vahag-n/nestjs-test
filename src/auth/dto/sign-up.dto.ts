import { IsNotEmpty, IsEmail, Validate } from 'class-validator';

import { Match } from 'src/shared/validators/fileds-match.validator';
import { IsUserAlreadyExist } from 'src/shared/validators/user-already-exists.validator';

export class SignUpUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Validate(IsUserAlreadyExist)
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;
}
