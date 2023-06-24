import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { User } from 'src/user/entities/user.entity';

import { Token } from './entities/token.entity';

type UserTknPayload = Pick<User, 'id' | 'email'>;

export interface UserTkns {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly userTokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateTokens(payload: UserTknPayload): UserTkns {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwtAccessSecret'),
      expiresIn: '30m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwtRefreshSecret'),
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveUserToken(userId: number, refreshToken: string): Promise<Token> {
    const tokenData = await this.userTokenRepository.findOne({
      where: { id: userId },
    });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return this.userTokenRepository.save(tokenData);
    }

    const token = this.userTokenRepository.create({
      refreshToken,
      user: { id: userId },
    });

    await this.userTokenRepository.save(token);
  }

  async remove(refreshToken: string): Promise<string> {
    const token = await this.userTokenRepository.findOne({
      where: { refreshToken },
    });

    await this.userTokenRepository.remove(token);

    return token.refreshToken;
  }

  validateAccessToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwtAccessSecret'),
      });

      return userData;
    } catch (err) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwtRefreshSecret'),
      });

      return userData;
    } catch (err) {
      return null;
    }
  }

  async findOne(where: FindOneOptions) {
    const token = await this.userTokenRepository.findOne(where);

    if (!token) {
      throw new NotFoundException(`There isn't any token with this identifier`);
    }

    return token;
  }
}
