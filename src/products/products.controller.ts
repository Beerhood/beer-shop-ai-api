import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FindQueryDto } from '@common/dto/query/find-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { IdMongoParamsDto } from '@common/dto/params/id-params.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoles } from '@utils/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';

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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.ADMIN)
  async create(@Body() product: CreateProductDto) {
    return await this.productsService.create(product);
  }
}
