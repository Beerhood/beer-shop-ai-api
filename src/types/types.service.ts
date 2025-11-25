import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TypesRepository } from './types.repository';
import { FindQueryDto } from '@common/dto/query/find-query.dto';
import { SortOrder } from '@utils/constants/sort-order';
import { GetAll } from '@utils/types/response.interface';
import { Type } from '@common/models';
import { ERROR_MESSAGES } from '@utils/errors/error-messages';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { ProductsRepository } from 'src/products/products.repository';

@Injectable()
export class TypesService {
  constructor(
    private readonly typesRepository: TypesRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async findAll(query: FindQueryDto): Promise<GetAll<Type>> {
    const categories = await this.typesRepository.find(
      query.filter,
      query.sort as Record<string, SortOrder> | undefined,
      query.limit,
      query.skip,
      query.search,
    );

    const totalCount = await this.typesRepository.count(query.filter, query.search);

    return { items: this.typesRepository.toObject(categories), totalCount };
  }

  async findOne(id: string) {
    const category = await this.typesRepository.findById(id);
    if (!category) throw new NotFoundException(ERROR_MESSAGES.getNotFoundMessage('Type'));

    return this.typesRepository.toObject(category);
  }

  async create(category: CreateTypeDto) {
    return this.typesRepository.toObject(await this.typesRepository.createOne(category));
  }

  async update(id: string, category: UpdateTypeDto) {
    const currentType = await this.typesRepository.findById(id);
    if (!currentType) throw new NotFoundException(ERROR_MESSAGES.getNotFoundMessage('Type'));

    if (category.productType && category.productType !== currentType.productType) {
      const product = await this.productsRepository.findOneByCategory(id);
      if (product)
        throw new ConflictException(
          ERROR_MESSAGES.getForeignKeyConstraintMessage('Type', 'Products', 'update'),
        );
    }

    const newCategory = await this.typesRepository.findByIdAndUpdate(id, category);
    if (!newCategory) throw new NotFoundException(ERROR_MESSAGES.getNotFoundMessage('Type'));
    return this.typesRepository.toObject(newCategory);
  }

  async delete(id: string) {
    const product = await this.productsRepository.findOneByCategory(id);
    if (product)
      throw new ConflictException(
        ERROR_MESSAGES.getForeignKeyConstraintMessage('Type', 'Products', 'delete'),
      );

    const deletedCount = await this.typesRepository.deleteById(id);
    if (deletedCount === 0) throw new NotFoundException(ERROR_MESSAGES.getNotFoundMessage('Type'));

    return;
  }
}
