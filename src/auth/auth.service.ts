import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from 'src/user/user.service';

import { SignInUserDto } from './dto/sign-in.dto';
import { TokenService } from './token.service';
import { SignUpUserDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(signUpData: SignUpUserDto) {
    const user = await this.userService.create(signUpData);
    delete user.password;
    return user;
  }

  async signIn({ email, password }: SignInUserDto) {
    const user = await this.userService.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`,
      );
    }

    if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${email}`,
      );
    }

    delete user.password;

    return user;
  }

  async signOut(refreshToken: string) {
    return refreshToken;
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await this.tokenService.findOne({
      where: { refreshToken },
    });

    if (!userData || !tokenFromDB) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({
      where: { id: userData.id },
    });

    return user;
  }
}
