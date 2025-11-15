import {
  GoogleUserPayload,
  JwtRefreshPayload,
  JwtPayload,
} from 'src/auth/interfaces/auth-payloads.interface';

type UserPayloads = GoogleUserPayload | JwtPayload | JwtRefreshPayload;

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayloads;
    }
  }
}
