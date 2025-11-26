import { Injectable, Inject, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '@common/models/';
import { UsersServiceInterface } from 'src/users/interfaces/users-service.interface'; // PLACEHOLDER, NEED TO BE IMPLEMENTED IN FUTURE
import { USER_SERVICE_TOKEN } from 'src/users/constants/user.const';
import { AuthServiceInterface } from './interfaces/auth-service.interface';
import { GoogleUserPayload, JwtPayload } from './interfaces/auth-payloads.interface';
import { AppConfiguration } from 'src/config/configuration';
import { AuthTokensResponse } from './interfaces/auth-responses.interface';
import { RefreshTokensRequest } from './interfaces/auth-requests.interface';
import { AUTH_ACCESS_DENIED_EXCEPTION } from './constants/auth.const';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject(USER_SERVICE_TOKEN)
    private readonly usersService: UsersServiceInterface,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfiguration>,
  ) {}

  async signIn(googleUser: GoogleUserPayload): Promise<AuthTokensResponse> {
    // TODO: add type
    let user: any;
    try {
      user = await this.usersService.findUserByEmail(googleUser.email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const googleUserData: GoogleUserPayload = {
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
        };
        user = await this.usersService.createUser(googleUserData);
      } else {
        throw error;
      }
    }
    // TODO: remove after adding type
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const tokens = await this.getTokens(user._id, user.email, user.role);
    // TODO: remove after adding type
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    await this.updateRefreshTokenHash(user._id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(req: RefreshTokensRequest): Promise<AuthTokensResponse> {
    const { userId, refreshToken } = req;
    const user: User = await this.usersService.findUserById(userId);
    if (!user.refreshToken) throw new UnauthorizedException(AUTH_ACCESS_DENIED_EXCEPTION);
    const matches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matches) throw new UnauthorizedException(AUTH_ACCESS_DENIED_EXCEPTION);
    const tokens = await this.getTokens(userId, user.email, user.role);
    await this.updateRefreshTokenHash(userId, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.update(userId, { refreshToken: null });
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, { refreshToken: hashedRefreshToken });
  }

  private async getTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.accessTokenSecret', { infer: true })!,
        expiresIn: this.configService.get('jwt.accessTokenExpiresIn', { infer: true })!,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshTokenSecret', { infer: true })!,
        expiresIn: this.configService.get('jwt.refreshTokenExpiresIn', { infer: true })!,
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
