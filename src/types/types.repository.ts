import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { IType, TypesModel } from '@common/models/';

@Injectable()
export class TypesRepository extends BaseRepository<IType> {
  constructor() {
    super(TypesModel);
  }
}
