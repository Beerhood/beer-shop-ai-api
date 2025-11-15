import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { Order, OrdersModel } from '@common/models/';
import { FilterQuery, SortOrder } from 'mongoose';

@Injectable()
export class OrdersRepository extends BaseRepository<Order> {
  constructor() {
    super(OrdersModel);
  }

  override find(
    filter: FilterQuery<Order>,
    sort?: Record<string, SortOrder>,
    limit?: number,
    skip?: number,
    search?: FilterQuery<Order>,
    projection?: NonNullable<unknown> | string | string[],
    options?: NonNullable<unknown>,
  ) {
    return super.find(filter, sort, limit, skip, search, projection, options).populate('products');
  }

  override findOne(
    conditions: FilterQuery<Order>,
    projection?: object | string | string[],
    options?: object,
  ) {
    return super.findOne(conditions, projection, options).populate('products');
  }

  override findById(id: string, projection?: object | string | string[], options?: object) {
    return super.findById(id, projection, options).populate('products');
  }
}
