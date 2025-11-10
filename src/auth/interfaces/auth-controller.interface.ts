import { SignInResponseInterface } from './auth.interface';
import { Request } from 'express';

export interface AuthControllerInterface {
  googleAuth(req: Request): void;
  googleAuthRedirect(req: Request): Promise<SignInResponseInterface>;
}
