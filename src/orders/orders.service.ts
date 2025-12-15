import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { FindQueryDto } from '@common/dto/query/find-query.dto';
import { CreateOrderDto, ProductInOrderDto } from './dto/create-order.dto';
import { SortOrder } from '@utils/constants/sort-order';
import { GetAll } from '@utils/types/response.interface';
import { Order } from '@common/models';
import { ORDERS_ERROR_MESSAGES } from './constants/error-messages.const';
import { OrderStatuses } from '@utils/enums';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(query: FindQueryDto, userId: string): Promise<GetAll<Order>> {
    const orders = await this.ordersRepository.findAllByUser(
      userId,
      query.filter,
      query.sort as Record<string, SortOrder> | undefined,
      query.limit,
      query.skip,
      query.search,
    );

    const count = await this.ordersRepository.countByUser(userId, query.filter, query.search);

    return { items: orders, totalCount: count };
  }

  async findOne(id: string, userId: string) {
    const order = await this.ordersRepository.findByIdAndUser(id, userId);
    if (!order) throw new NotFoundException(ORDERS_ERROR_MESSAGES.NOT_FOUND);
    return order;
  }

  async create(order: CreateOrderDto, userId: string) {
    const { expectedTotal, products, ...rest } = order;
    const mergedProducts = this.mergeDuplicateProducts(products);

    const totalPrice = await this.productsService.getTotalPrice(mergedProducts);
    if (expectedTotal !== null && expectedTotal !== undefined && expectedTotal !== totalPrice)
      throw new ConflictException(ORDERS_ERROR_MESSAGES.TOTAL_PRICE_DISCREPANCY);

    try {
      return this.ordersRepository.toObject(
        await this.ordersRepository.createOne({
          ...rest,
          products: mergedProducts,
          user: userId,
          status: OrderStatuses.PENDING,
          totalPrice,
        }),
      );
    } catch (err) {
      if (err instanceof ConflictException && err.message.includes('User'))
        throw new UnauthorizedException(ORDERS_ERROR_MESSAGES.UNAUTHORIZED);
      throw err;
    }
  }

  private mergeDuplicateProducts(products: ProductInOrderDto[]): ProductInOrderDto[] {
    const map = new Map<string, number>();

    products.forEach((p) => {
      const currentCount = map.get(p.item) || 0;
      map.set(p.item, currentCount + p.count);
    });

    return Array.from(map.entries()).map(([item, count]) => ({
      item,
      count,
    }));
  }
}
