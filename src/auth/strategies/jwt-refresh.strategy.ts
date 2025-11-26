import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AppConfiguration } from 'src/config/configuration';
import { JWT_REFRESH_STRATEGY_NAME, COOKIE_REFRESH_TOKEN } from '../constants/auth.const';
import {
  JwtRefreshPayload,
  JwtPayload,
  JwtPayloadWithRefreshToken,
} from '../interfaces/auth-payloads.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, JWT_REFRESH_STRATEGY_NAME) {
  constructor(private readonly configService: ConfigService<AppConfiguration>) {
    const jwtConfig = configService.get('jwt', { infer: true })!;
    const options = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies?.[COOKIE_REFRESH_TOKEN] as string | undefined;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.refreshTokenSecret,
      passReqToCallback: true,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(options);
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req.cookies?.[COOKIE_REFRESH_TOKEN] as string;
    const result: JwtRefreshPayload = {
      ...payload,
      refreshToken,
    };
    return result;
  }
}
