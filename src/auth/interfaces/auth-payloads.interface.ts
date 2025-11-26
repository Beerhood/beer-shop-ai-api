export interface GoogleUserPayload {
  email: string;
  firstName: string;
  lastName: string | null;
}

export interface JwtRefreshPayload {
  sub: string;
  email: string;
  role: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}
