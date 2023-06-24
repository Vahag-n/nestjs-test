import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import type { Response } from 'express';

import { TokenService } from '../token.service';

@Injectable()
export class RemoveTokenInterceptor implements NestInterceptor {
  constructor(private readonly tokenService: TokenService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<string>,
  ): Promise<Observable<{ [key: string]: string }>> {
    return next.handle().pipe(
      mergeMap(async (refreshToken) => {
        const response = context.switchToHttp().getResponse<Response>();
        const token = await this.tokenService.remove(refreshToken);
        response.clearCookie('refreshToken');

        return { token };
      }),
    );
  }
}
