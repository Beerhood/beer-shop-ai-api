import { Injectable, Inject, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserInterface } from '../users/users.service';
import { UsersServiceInterface } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { USER_SERVICE_TOKEN } from 'src/users/users.module';
import { NO_USER_FROM_GOOGLE_EXCEPTION } from './constants/auth.const';
import { AuthServiceInterface } from './interfaces/auth-service.interface';
import { SignInResponseInterface, GoogleUserDataInterface } from './interfaces/auth.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject(USER_SERVICE_TOKEN)
    private readonly usersService: UsersServiceInterface,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(req: Request): Promise<SignInResponseInterface> {
    if (!req.user) {
      throw new UnauthorizedException(NO_USER_FROM_GOOGLE_EXCEPTION);
    }
    const googleUser = req.user;
    let user: UserInterface;
    try {
      user = await this.usersService.findOne(googleUser.email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const googleUserData: GoogleUserDataInterface = {
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
        };
        user = await this.usersService.createUser(googleUserData);
      } else {
        throw error;
      }
    }
    const payload = { sub: user.userId, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
