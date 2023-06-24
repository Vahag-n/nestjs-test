import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';

import { SignUpUserDto } from 'src/auth/dto/sign-up.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(userDto: SignUpUserDto) {
    const user = this.userRepository.create(userDto);
    return await this.userRepository.save(user);
  }

  async findOne(where: FindOneOptions) {
    const user = await this.userRepository.findOne(where);

    if (!user) {
      throw new NotFoundException(
        `There isn't any user with identifier: ${where}`,
      );
    }

    return user;
  }

  async update(id: number, updatesUser: any) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
    this.userRepository.merge(user, updatesUser);
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
