import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { GOOGLE_STRATEGY_NAME } from '../constants/auth.const';
import { EMAIL_NOT_PROVIDED_BY_GOOGLE_EXCEPTION } from '../constants/auth.const';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_STRATEGY_NAME) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('google.clientId')!,
      clientSecret: configService.get<string>('google.clientSecret')!,
      callbackURL: configService.get<string>('google.callbackUrl')!,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const { name, emails } = profile;
    if (!emails || emails.length === 0) {
      return done(new UnauthorizedException(EMAIL_NOT_PROVIDED_BY_GOOGLE_EXCEPTION), false);
    }
    const user = {
      email: emails[0].value,
      firstName: name?.givenName ?? 'Bob',
      lastName: name?.familyName ?? '',
      accessToken,
    };
    done(null, user);
  }
}
