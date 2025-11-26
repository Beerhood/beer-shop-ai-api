import { Body, Controller, Get, Inject, Patch, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { USER_ROUTE_PATH, USER_SERVICE_TOKEN } from './constants/user.const';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotEmptyBodyPipe } from '@common/pipes/not-empty.pipe';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayloadRequest } from 'src/auth/interfaces/auth-requests.interface';

@Controller(USER_ROUTE_PATH.CONTROLLER)
export class UsersController {
  constructor(@Inject(USER_SERVICE_TOKEN) private readonly usersService: UsersService) {}

  @Get(USER_ROUTE_PATH.GET_PROFILE)
  @UseGuards(AuthGuard('jwt'))
  async findProfile(@Request() req: JwtPayloadRequest) {
    return await this.usersService.findProfile(req.user.sub);
  }

  @Patch(USER_ROUTE_PATH.PATCH_PROFILE)
  @UseGuards(AuthGuard('jwt'))
  async update(@Body(NotEmptyBodyPipe) profile: UpdateUserDto, @Request() req: JwtPayloadRequest) {
    return await this.usersService.updateProfile(req.user.sub, profile);
  }
}
