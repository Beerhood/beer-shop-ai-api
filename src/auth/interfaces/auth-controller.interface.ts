import { Request, Response } from 'express';
import {
  GoogleAuthRedirectRequest,
  AuthRefreshTokensRequest,
  AuthLogoutRequest,
} from './auth-requests.interface';
import { AuthTokensResponse } from './auth-responses.interface';

export interface AuthControllerInterface {
  googleAuth(req: Request): void;
  googleAuthRedirect(req: GoogleAuthRedirectRequest, res: Response): Promise<AuthTokensResponse>;
  refreshTokens(req: AuthRefreshTokensRequest, res: Response): Promise<AuthTokensResponse>;
  logout(req: AuthLogoutRequest, res: Response): Promise<void>;
}
