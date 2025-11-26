import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FindQueryDto } from '@common/dto/query/find-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { IdMongoParamsDto } from '@common/dto/params/id-params.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: FindQueryDto) {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param() params: IdMongoParamsDto) {
    const product = await this.productsService.findOne(params.id);
    return product;
  }

  @Post()
  async create(@Body() product: CreateProductDto) {
    return await this.productsService.create(product);
  }
}
