import { AuthTokensResponse } from './auth-responses.interface';
import { GoogleUserPayload } from './auth-payloads.interface';
import { RefreshTokensRequest } from './auth-requests.interface';

export interface AuthServiceInterface {
  signIn(googleUser: GoogleUserPayload): Promise<AuthTokensResponse>;
  refreshTokens(req: RefreshTokensRequest): Promise<AuthTokensResponse>;
  logout(userId: string): Promise<void>;
}
