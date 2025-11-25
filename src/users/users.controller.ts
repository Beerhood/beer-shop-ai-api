import { Body, Controller, Get, Inject, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { USER_ROUTE_PATH, USER_SERVICE_TOKEN } from './constants/user.const';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotEmptyBodyPipe } from '@common/pipes/not-empty.pipe';

@Controller(USER_ROUTE_PATH.CONTROLLER)
export class UsersController {
  constructor(@Inject(USER_SERVICE_TOKEN) private readonly usersService: UsersService) {}

  @Get(USER_ROUTE_PATH.GET_PROFILE)
  async findProfile() {
    const id = process.env.TEST_USER_ID ?? ''; // TODO: remove after adding req.user
    return await this.usersService.findProfile(id);
  }

  @Patch(USER_ROUTE_PATH.PATCH_PROFILE)
  async update(@Body(NotEmptyBodyPipe) profile: UpdateUserDto) {
    const id = process.env.TEST_USER_ID ?? ''; // TODO: remove after adding req.user
    return this.usersService.updateProfile(id, profile);
  }
}
