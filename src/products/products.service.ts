import { Injectable, NotFoundException } from '@nestjs/common';
import { type CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';
import { type FindQueryDto } from '@common/dto/query/find-query.dto';
import { ERROR_MESSAGES } from '@utils/errors/error-messages';
import { type SortOrder } from '@utils/constants/sort-order';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async findAll(query: FindQueryDto) {
    const products = await this.productsRepository.find(
      query.filter,
      query.sort as Record<string, SortOrder> | undefined,
      query.limit,
      query.skip,
      query.search,
    );
    const count = this.productsRepository.count(query.filter as any, query.search as any);
    return { items: products, totalCount: count };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException(ERROR_MESSAGES.getNotFoundMessage('Product'));
    return product;
  }

  async create(product: CreateProductDto) {
    return this.productsRepository.createOne(product);
  }
}
