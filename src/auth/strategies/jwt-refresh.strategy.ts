import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AppConfiguration } from 'src/config/configuration';
import { JWT_REFRESH_STRATEGY_NAME } from '../constants/auth.const';
import { JwtRefreshPayload, JwtPayload } from '../interfaces/auth-payloads.interface';

export interface JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, JWT_REFRESH_STRATEGY_NAME) {
  constructor(configService: ConfigService<AppConfiguration>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const refreshToken = req.cookies?.['refreshToken'] as string | undefined;
          return refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.refreshTokenSecret', { infer: true }),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req.cookies?.['refreshToken'] as string;
    const result: JwtRefreshPayload = {
      ...payload,
      refreshToken,
    };
    return result;
  }
}
