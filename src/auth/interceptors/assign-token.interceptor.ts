import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import type { Response } from 'express';

import { User } from 'src/user/entities/user.entity';
import { TokenService } from '../token.service';

@Injectable()
export class AssignTokenInterceptor implements NestInterceptor {
  constructor(private readonly tokenService: TokenService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Promise<Observable<User>> {
    return next.handle().pipe(
      mergeMap(async (user) => {
        const response = context.switchToHttp().getResponse<Response>();
        const { accessToken, refreshToken } = this.tokenService.generateTokens({
          id: user.id,
          email: user.email,
        });

        await this.tokenService.saveUserToken(user.id, refreshToken);

        response.setHeader('Authorization', `Bearer ${accessToken}`);
        response.cookie('refreshToken', refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'strict',
        });
        delete user.password;

        return user;
      }),
    );
  }
}
