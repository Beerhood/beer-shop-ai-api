import { Controller, Get, Req, UseGuards, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthServiceInterface } from './interfaces/auth-service.interface';
import { SignInResponseInterface } from './interfaces/auth.interface';
import { AUTH_SERVICE_TOKEN } from './constants/auth.const';
import { GOOGLE_STRATEGY_NAME } from './constants/auth.const';
import { AUTH_ROOT_PATH } from './constants/auth.const';
import { AuthControllerInterface } from './interfaces/auth-controller.interface';

@Controller(AUTH_ROOT_PATH.CONTROLLER)
export class AuthController implements AuthControllerInterface {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN)
    private readonly authService: AuthServiceInterface,
  ) {}

  @Get(AUTH_ROOT_PATH.GOOGLE)
  @UseGuards(AuthGuard(GOOGLE_STRATEGY_NAME))
  /*eslint-disable-next-line @typescript-eslint/no-unused-vars*/
  googleAuth(@Req() req: Request): void {}

  @Get(AUTH_ROOT_PATH.GOOGLE_CALLBACK)
  @UseGuards(AuthGuard(GOOGLE_STRATEGY_NAME))
  googleAuthRedirect(@Req() req: Request): Promise<SignInResponseInterface> {
    return this.authService.signIn(req);
  }
}
