import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { TokenService } from '../token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException();
      }

      const [_, accessToken] = authHeader.split(' ');

      if (!accessToken) {
        throw new UnauthorizedException();
      }

      const userPayload = this.tokenService.validateAccessToken(accessToken);

      if (!userPayload) {
        throw new UnauthorizedException();
      }

      request['user'] = { id: userPayload.id, email: userPayload.email };

      return true;
    } catch (e) {
      console.log(`Error in this file: ${__filename}`, e);
      throw new UnauthorizedException();
    }
  }
}
