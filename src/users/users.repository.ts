import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { User, UsersModel } from '@common/models/';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor() {
    super(UsersModel);
  }
}
