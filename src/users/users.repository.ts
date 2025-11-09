import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { IUser, UsersModel } from '@common/models/';

@Injectable()
export class UsersRepository extends BaseRepository<IUser> {
  constructor() {
    super(UsersModel);
  }
}
