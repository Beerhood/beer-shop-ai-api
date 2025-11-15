export interface ResponseWithTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AccessTokenResponse {
  accessToken: string;
}

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}
