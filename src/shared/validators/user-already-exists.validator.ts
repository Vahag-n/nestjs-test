import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';

import { User } from 'src/user/entities/user.entity';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    console.log('%c user ===>', 'color: #0a95ff', user);

    return user === null || user === undefined;
  }

  defaultMessage(): string {
    return 'The email «$value» is already register.';
  }
}
