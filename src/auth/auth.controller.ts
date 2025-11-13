import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import {
  GoogleAuthRedirectRequest,
  AuthRefreshTokensRequest,
  AuthLogoutRequest,
} from './interfaces/auth-requests.interface';
import {
  AUTH_SERVICE_TOKEN,
  GOOGLE_STRATEGY_NAME,
  JWT_STRATEGY_NAME,
  JWT_REFRESH_STRATEGY_NAME,
  AUTH_ROOT_PATH,
  COOKIE_REFRESH_TOKEN,
} from './constants/auth.const';
import { AuthTokensResponse } from './interfaces/auth-responses.interface';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { AuthControllerInterface } from './interfaces/auth-controller.interface';
import { AuthServiceInterface } from './interfaces/auth-service.interface';

@Controller(AUTH_ROOT_PATH.CONTROLLER)
@UseInterceptors(RefreshTokenInterceptor)
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
  async googleAuthRedirect(@Req() req: GoogleAuthRedirectRequest): Promise<AuthTokensResponse> {
    return this.authService.signIn(req.user);
  }

  @Post(AUTH_ROOT_PATH.REFRESH)
  @UseGuards(AuthGuard(JWT_REFRESH_STRATEGY_NAME))
  async refreshTokens(@Req() req: AuthRefreshTokensRequest): Promise<AuthTokensResponse> {
    return this.authService.refreshTokens({
      userId: req.user.sub,
      refreshToken: req.user.refreshToken,
    });
  }

  @Post(AUTH_ROOT_PATH.LOGOUT)
  @UseGuards(AuthGuard(JWT_STRATEGY_NAME))
  async logout(
    @Req() req: AuthLogoutRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(req.user.sub);
    res.clearCookie(COOKIE_REFRESH_TOKEN);
  }
}
