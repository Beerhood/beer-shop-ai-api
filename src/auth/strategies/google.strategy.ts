import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from 'src/config/configuration';
import {
  GOOGLE_STRATEGY_NAME,
  EMAIL_NOT_PROVIDED_BY_GOOGLE_EXCEPTION,
  DEFAULT_USER_FIRST_NAME,
  DEFAULT_USER_LAST_NAME,
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
    const { emails } = profile;
    if (!emails || emails.length === 0) {
      return done(new UnauthorizedException(EMAIL_NOT_PROVIDED_BY_GOOGLE_EXCEPTION), false);
    }
    const email = emails[0].value;
    const { firstName, lastName } = this.extractUserName(profile, email);
    const user: GoogleUserPayload = {
      email,
      firstName,
      lastName,
    };
    done(null, user);
  }

  private extractUserName(
    profile: Profile,
    email: string,
  ): { firstName: string; lastName: string | null } {
    const firstName =
      profile.name?.givenName ||
      profile.displayName ||
      email.split('@')[0] ||
      DEFAULT_USER_FIRST_NAME;
    const lastName = profile.name?.familyName || DEFAULT_USER_LAST_NAME;
    return { firstName, lastName };
  }
}
