import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { COOKIE_REFRESH_TOKEN } from '../constants/auth.const';
import { ResponseWithTokens, AccessTokenResponse } from '../interfaces/auth-responses.interface';

const sameSiteOption = 'strict';
const expiresIn = 7 * 24 * 60 * 60 * 1000; //7 days

@Injectable()
export class RefreshTokenInterceptor
  implements NestInterceptor<ResponseWithTokens, AccessTokenResponse>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<AccessTokenResponse> {
    return next.handle().pipe(
      map((data: ResponseWithTokens) => {
        if (data && data.refreshToken) {
          const res = context.switchToHttp().getResponse<Response>();

          res.cookie(COOKIE_REFRESH_TOKEN, data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: sameSiteOption,
            expires: new Date(Date.now() + expiresIn),
          });

          delete data.refreshToken;
        }
        return data;
      }),
    );
  }
}
