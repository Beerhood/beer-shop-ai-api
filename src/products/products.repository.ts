import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { IProduct, ProductsModel } from '@common/models/';
import { FilterQuery, SortOrder } from 'mongoose';

@Injectable()
export class ProductsRepository extends BaseRepository<IProduct> {
  constructor() {
    super(ProductsModel);
  }
  override find(
    filter: FilterQuery<IProduct>,
    sort: Record<string, SortOrder>,
    limit: number,
    skip: number,
    search: FilterQuery<IProduct>,
    projection?: NonNullable<unknown> | string | string[],
    options?: NonNullable<unknown>,
  ) {
    return super.find(filter, sort, limit, skip, search, projection, options).populate('type');
  }

  override findOne(
    conditions: FilterQuery<IProduct>,
    projection?: object | string | string[],
    options?: object,
  ) {
    return super.findOne(conditions, projection, options).populate('type');
  }

  override findById(id: string, projection?: object | string | string[], options?: object) {
    return super.findById(id, projection, options).populate('type');
  }
}
