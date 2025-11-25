import { Request } from 'express';
import { GoogleUserPayload, JwtRefreshPayload, JwtPayload } from './auth-payloads.interface';

export interface GoogleAuthRedirectRequest extends Request {
  user: GoogleUserPayload;
}

export interface AuthRefreshTokensRequest extends Request {
  user: JwtRefreshPayload;
}

export interface AuthLogoutRequest extends Request {
  user: JwtPayload;
}

export interface RefreshTokensRequest {
  userId: string;
  refreshToken: string;
}
