import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { USER_SERVICE_TOKEN } from './constants/user.const';

@Module({
  controllers: [UsersController],
  providers: [{ provide: USER_SERVICE_TOKEN, useClass: UsersService }, UsersRepository],
  exports: [USER_SERVICE_TOKEN, UsersRepository],
})
export class UsersModule {}
