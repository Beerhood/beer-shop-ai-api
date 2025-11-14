import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from 'src/config/configuration';
import {
  GOOGLE_STRATEGY_NAME,
  EMAIL_NOT_PROVIDED_BY_GOOGLE_EXCEPTION,
} from '../constants/auth.const';
import { GoogleUserPayload } from '../interfaces/auth-payloads.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_STRATEGY_NAME) {
  constructor(private readonly configService: ConfigService<AppConfiguration>) {
    const googleConfig = configService.get('google', { infer: true })!;
    const options = {
      clientID: googleConfig.clientId!,
      clientSecret: googleConfig.clientSecret!,
      callbackURL: googleConfig.callbackUrl,
      scope: ['email', 'profile'],
    };
    super(options);
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const { name, emails } = profile;
    if (!emails || emails.length === 0) {
      return done(new UnauthorizedException(EMAIL_NOT_PROVIDED_BY_GOOGLE_EXCEPTION), false);
    }
    const user: GoogleUserPayload = {
      email: emails[0].value,
      firstName: name?.givenName ?? 'Beer Bob',
      lastName: name?.familyName ?? '',
    };
    done(null, user);
  }
}
