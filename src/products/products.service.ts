import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';
import { type FindQueryDto } from '@common/dto/query/find-query.dto';
import { ERROR_MESSAGES } from '@utils/errors/error-messages';
import { type SortOrder } from '@utils/constants/sort-order';
import { TypesRepository } from 'src/types/types.repository';
import { PRODUCT_ERROR_MESSAGES } from './constants/error-messages';
import { ProductTypes } from '@utils/enums';
import { GetAll } from '@utils/types/response.interface';
import { Product } from '@common/models';
import Decimal from 'decimal.js';
import { BeerSearchCriteria } from 'src/ai/handlers/beer-recommendation.handler';
import { SnackSearchCriteria } from 'src/ai/handlers/snack-recommendation.handler';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly typesRepository: TypesRepository,
  ) {}

  async findAll(query: FindQueryDto): Promise<GetAll<Product>> {
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

  async getTotalPrice(productIds: string[]): Promise<number> {
    const products = await this.productsRepository.findByIds(productIds);
    if (products.length !== productIds.length)
      throw new ConflictException(PRODUCT_ERROR_MESSAGES.UNAVAILABLE_OR_INVALID);

    const totalPriceDecimal = products.reduce((acc, product) => {
      return acc.plus(new Decimal(product.price));
    }, new Decimal(0));

    return totalPriceDecimal.toDecimalPlaces(2).toNumber();
  }
}
