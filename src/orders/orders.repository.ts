import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { IOrder, OrdersModel } from '@common/models/';

@Injectable()
export class OrdersRepository extends BaseRepository<IOrder> {
  constructor() {
    super(OrdersModel);
  }
}
