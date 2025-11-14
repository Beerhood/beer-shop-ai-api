export interface GoogleUserPayload {
  email: string;
  firstName: string;
  lastName: string;
}

export interface JwtRefreshPayload {
  sub: number;
  email: string;
  role: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

export interface JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}
