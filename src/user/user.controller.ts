import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/guards/auth.guard';

import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getProfile(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    return this.userService.findOne({
      where: { id },
    });
  }
}
