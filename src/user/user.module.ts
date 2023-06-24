import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { Token } from 'src/auth/entities/token.entity';
import { TokenService } from 'src/auth/token.service';
import appConfig from 'src/config/app.config';
import { IsUserAlreadyExist } from 'src/shared/validators/user-already-exists.validator';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    JwtModule.register({}),
    ConfigModule.forFeature(appConfig),
  ],
  controllers: [UserController],
  providers: [UserService, IsUserAlreadyExist, TokenService],
  exports: [UserService],
})
export class UserModule {}
