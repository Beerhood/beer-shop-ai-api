import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/database/base.repository';
import { Product, ProductsModel } from '@common/models/';
import { FilterQuery, SortOrder } from 'mongoose';

@Injectable()
export class ProductsRepository extends BaseRepository<Product> {
  constructor() {
    super(ProductsModel);
  }

  /**
   * Finds all the documents populated by 'type' field that match conditions
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
    filter?: FilterQuery<Product>,
    sort?: Record<string, SortOrder>,
    limit?: number,
    skip?: number,
    search?: FilterQuery<Product>,
    projection?: NonNullable<unknown> | string | string[],
    options?: NonNullable<unknown>,
  ) {
    return super.find(filter, sort, limit, skip, search, projection, options).populate('type');
  }

  /**
   * Finds the first document populated by 'type' field that matches conditions
   * @param {object} conditions
   * @param {object|String|Array<String>} projection
   * @param {object} options
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.findOne}
   * @returns {*}
   */
  override findOne(
    conditions: FilterQuery<Product>,
    projection?: object | string | string[],
    options?: object,
  ) {
    return super.findOne(conditions, projection, options).populate('type');
  }

  /**
   * Finds a single document populated by 'type' field by its _id field
   * @param {string} id
   * @param {object|String|Array<String>} projection
   * @param {object} options
   * @see {@link https://mongoosejs.com/docs/api/model.html#model_Model.findById}
   * @returns {*}
   */
  override findById(id: string, projection?: object | string | string[], options?: object) {
    return super.findById(id, projection, options).populate('type');
  }
}
