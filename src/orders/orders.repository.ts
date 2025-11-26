import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/database/base.repository';
import { Order, OrdersModel } from '@common/models/';
import { FilterQuery, SortOrder } from 'mongoose';

@Injectable()
export class OrdersRepository extends BaseRepository<Order> {
  constructor() {
    super(OrdersModel);
  }

  /**
   * Finds all the documents populated by 'products' field that match conditions
   * @param {object} filter
   * @param {object} sort
   * @param {number} limit
   * @param {number} skip
   * @param {object|String|Array<String>} projection
   * @param {object} options
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.find}
   * @returns {*}
   */
  override find(
    filter?: FilterQuery<Order>,
    sort?: Record<string, SortOrder>,
    limit?: number,
    skip?: number,
    search?: FilterQuery<Order>,
    projection?: NonNullable<unknown> | string | string[],
    options?: NonNullable<unknown>,
  ) {
    return super.find(filter, sort, limit, skip, search, projection, options).populate('products');
  }

  /**
   * Finds the first document populated by 'products' field that matches conditions
   * @param {object} conditions
   * @param {object|String|Array<String>} projection
   * @param {object} options
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.findOne}
   * @returns {*}
   */
  override findOne(
    conditions: FilterQuery<Order>,
    projection?: object | string | string[],
    options?: object,
  ) {
    return super.findOne(conditions, projection, options).populate('products');
  }

  /**
   * Finds a single document populated by 'products' field by its _id field
   * @param {string} id
   * @param {object|String|Array<String>} projection
   * @param {object} options
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.findById}
   * @returns {*}
   */
  override findById(id: string, projection?: object | string | string[], options?: object) {
    return super.findById(id, projection, options).populate('products');
  }

  async findAllByUser(
    userId: string,
    filter?: FilterQuery<Order>,
    sort?: Record<string, SortOrder>,
    limit?: number,
    skip?: number,
    search?: FilterQuery<Order>,
  ) {
    return this.toObject(await this.find({ ...filter, user: userId }, sort, limit, skip, search));
  }

  async findByIdAndUser(id: string, userId: string) {
    return this.toObject(await this.findOne({ _id: id, user: userId }));
  }

  async countByUser(userId: string, filter?: FilterQuery<Order>, search?: FilterQuery<Order>) {
    return await this.count({ ...filter, user: userId }, search);
  }
}
