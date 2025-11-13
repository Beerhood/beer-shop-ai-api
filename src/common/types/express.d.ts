import { UserPayload } from '../../auth/interfaces/auth-requests.interface';

declare namespace Express {
  export interface Request {
    user?: UserPayload;
  }
}
