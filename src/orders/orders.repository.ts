import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { IOrder, OrdersModel } from '@common/models/';
import { FilterQuery, SortOrder } from 'mongoose';

@Injectable()
export class OrdersRepository extends BaseRepository<IOrder> {
  constructor() {
    super(OrdersModel);
  }

  override find(
    filter: FilterQuery<IOrder>,
    sort?: Record<string, SortOrder>,
    limit?: number,
    skip?: number,
    search?: FilterQuery<IOrder>,
    projection?: NonNullable<unknown> | string | string[],
    options?: NonNullable<unknown>,
  ) {
    return super.find(filter, sort, limit, skip, search, projection, options).populate('products');
  }

  override findOne(
    conditions: FilterQuery<IOrder>,
    projection?: object | string | string[],
    options?: object,
  ) {
    return super.findOne(conditions, projection, options).populate('products');
  }

  override findById(id: string, projection?: object | string | string[], options?: object) {
    return super.findById(id, projection, options).populate('products');
  }
}
