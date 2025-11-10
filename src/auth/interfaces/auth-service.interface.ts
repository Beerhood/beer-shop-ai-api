import { SignInResponseInterface } from './auth.interface';
import { Request } from 'express';

export interface AuthServiceInterface {
  signIn(req: Request): Promise<SignInResponseInterface>;
}
