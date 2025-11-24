import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { type CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';
import { type FindQueryDto } from '@common/dto/query/find-query.dto';
import { ERROR_MESSAGES } from '@utils/errors/error-messages';
import { type SortOrder } from '@utils/constants/sort-order';
import { TypesRepository } from 'src/types/types.repository';
import { PRODUCT_ERROR_MESSAGES } from './constants/error-messages';
import { ProductTypes } from '@utils/enums';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly typesRepository: TypesRepository,
  ) {}

  async findAll(query: FindQueryDto) {
    const products = await this.productsRepository.find(
      query.filter,
      query.sort as Record<string, SortOrder> | undefined,
      query.limit,
      query.skip,
      query.search,
    );
    const count = await this.productsRepository.count(query.filter, query.search);

    return { items: this.productsRepository.toObject(products), totalCount: count };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException(ERROR_MESSAGES.getNotFoundMessage('Product'));

    return this.productsRepository.toObject(product);
  }

  async create(product: CreateProductDto) {
    const category = await this.typesRepository.findById(product.type);
    if (!category) throw new NotFoundException(ERROR_MESSAGES.getNotFoundMessage('Category'));

    if (category.productType !== product.productType)
      throw new BadRequestException(PRODUCT_ERROR_MESSAGES.INCORRECT_CATEGORY);

    return this.productsRepository.toObject(await this.productsRepository.createOne(product));
  }

  async findRecommended(
    criteria: BeerSearchCriteria | SnackSearchCriteria,
    productType: ProductTypes,
    count: number,
  ) {
    return this.productsRepository.findByCriteria(criteria, productType, count);
  }
}

// TODO : Remove after feat/ai-module merge
interface BeerSearchCriteria {
  country?: string[];
  brand?: string[];
  details?: {
    style?: string[];
    minABV?: number; // Міцність
    maxABV?: number;
    minIBU?: number; // Гіркота
    maxIBU?: number;
    OG?: number; // Початкова густина}
  };
}

interface SnackSearchCriteria {
  country?: string[];
  brand?: string[];
  details?: {
    flavor?: string[];
  };
}
