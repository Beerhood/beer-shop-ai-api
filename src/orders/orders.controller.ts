import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FindQueryDto } from '@common/dto/query/find-query.dto';
import { IdMongoParamsDto } from '@common/dto/params/id-params.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query() query: FindQueryDto) {
    const userId = process.env.TEST_USER_ID ?? ''; // TODO: remove after adding req.user
    return await this.ordersService.findAll(query, userId);
  }

  @Get(':id')
  async findOne(@Param() params: IdMongoParamsDto) {
    const userId = process.env.TEST_USER_ID ?? ''; // TODO: remove after adding req.user
    return await this.ordersService.findOne(params.id, userId);
  }

  @Post()
  async create(@Body() order: CreateOrderDto) {
    const userId = process.env.TEST_USER_ID ?? ''; // TODO: remove after adding req.user
    return await this.ordersService.create(order, userId);
  }
}
