import { User } from '@common/models';
import { GoogleUserPayload } from 'src/auth/interfaces/auth-payloads.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRefreshToken } from './refresh-token.interface';

export interface UsersServiceInterface {
  findUserById(id: string): Promise<User>;
  findUserByEmail(email: string): Promise<User>;
  createUser(googleUserData: GoogleUserPayload): Promise<User>;
  update(id: string, user: UpdateUserDto & UserRefreshToken): Promise<User>;
}
