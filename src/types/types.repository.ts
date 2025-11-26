import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/database/base.repository';
import { Type, TypesModel } from '@common/models/';

@Injectable()
export class TypesRepository extends BaseRepository<Type> {
  constructor() {
    super(TypesModel);
  }

  async deleteById(id: string) {
    return (await this.deleteOne({ _id: id })).deletedCount;
  }
}
