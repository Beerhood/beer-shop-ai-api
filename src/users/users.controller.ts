import { Controller, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { USER_SERVICE_TOKEN } from './constants/user.const';

@Controller('users')
export class UsersController {
  constructor(@Inject(USER_SERVICE_TOKEN) private readonly usersService: UsersService) {}
}
