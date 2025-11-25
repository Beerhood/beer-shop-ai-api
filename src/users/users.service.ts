import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { USER_ERROR_MESSAGES } from './constants/error-messages.const';
import { User } from '@common/models';
import { UsersServiceInterface } from './interfaces/users-service.interface';
import { GoogleUserPayload } from 'src/auth/interfaces/auth-payloads.interface';
import { UserRoles } from '@utils/enums';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRefreshToken } from './interfaces/refresh-token.interface';

@Injectable()
export class UsersService implements UsersServiceInterface {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(USER_ERROR_MESSAGES.NOT_FOUND);
    return this.usersRepository.toObject(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new NotFoundException(USER_ERROR_MESSAGES.NOT_FOUND);
    return user;
  }

  async findProfile(id: string): Promise<Omit<User, 'refreshToken'>> {
    try {
      const { refreshToken, ...profile } = await this.findUserById(id);
      return profile;
    } catch (err) {
      if (err instanceof NotFoundException)
        throw new UnauthorizedException(USER_ERROR_MESSAGES.UNAUTHORIZED);
      throw err;
    }
  }

  async createUser(googleUserData: GoogleUserPayload): Promise<User> {
    const user = { ...googleUserData, role: UserRoles.CUSTOMER };
    return this.usersRepository.toObject(await this.usersRepository.createOne(user));
  }

  async update(id: string, user: UpdateUserDto & UserRefreshToken): Promise<User> {
    const updatedUser = await this.usersRepository.findByIdAndUpdate(id, user);
    if (!updatedUser) throw new NotFoundException(USER_ERROR_MESSAGES.NOT_FOUND);
    return this.usersRepository.toObject(updatedUser);
  }

  async updateProfile(id: string, profile: UpdateUserDto): Promise<Omit<User, 'refreshToken'>> {
    try {
      const { refreshToken, ...updatedProfile } = await this.update(id, profile);
      return updatedProfile;
    } catch (err) {
      if (err instanceof NotFoundException)
        throw new UnauthorizedException(USER_ERROR_MESSAGES.UNAUTHORIZED);
      throw err;
    }
  }
}
