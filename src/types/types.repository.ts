import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { Type, TypesModel } from '@common/models/';

@Injectable()
export class TypesRepository extends BaseRepository<Type> {
  constructor() {
    super(TypesModel);
  }
}
