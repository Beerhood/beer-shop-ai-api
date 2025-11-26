import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FindQueryDto } from '@common/dto/query/find-query.dto';
import { IdMongoParamsDto } from '@common/dto/params/id-params.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtPayloadRequest } from 'src/auth/interfaces/auth-requests.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Query() query: FindQueryDto, @Request() req: JwtPayloadRequest) {
    return await this.ordersService.findAll(query, req.user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param() params: IdMongoParamsDto, @Request() req: JwtPayloadRequest) {
    return await this.ordersService.findOne(params.id, req.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() order: CreateOrderDto, @Request() req: JwtPayloadRequest) {
    return await this.ordersService.create(order, req.user.sub);
  }
}
