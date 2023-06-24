import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  HttpCode,
  UseInterceptors,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { User } from 'src/user/entities/user.entity';
import { AuthUser, Cookie } from 'src/shared/decorators/common';

import { AssignTokenInterceptor } from './interceptors/assign-token.interceptor';
import { RemoveTokenInterceptor } from './interceptors/remove-token.interceptor';
import { SignInUserDto } from './dto/sign-in.dto';
import { SignUpUserDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(AssignTokenInterceptor)
  signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() signUpData: SignUpUserDto,
  ): Promise<User> {
    return this.authService.signUp(signUpData);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AssignTokenInterceptor)
  signIn(@Body() signInData: SignInUserDto): Promise<User> {
    return this.authService.signIn(signInData);
  }

  @Post('/signout')
  @UseInterceptors(RemoveTokenInterceptor)
  signOut(@Req() req: Request) {
    const { refreshToken } = req.cookies;
    return this.authService.signOut(refreshToken);
  }

  @Get('/refresh')
  @UseInterceptors(AssignTokenInterceptor)
  refreshToken(@Cookie('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  me(@AuthUser() user: User): User {
    return user;
  }
}
