import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TypesService } from './types.service';
import { FindQueryDto } from '@common/dto/query/find-query.dto';
import { IdMongoParamsDto } from '@common/dto/params/id-params.dto';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { NotEmptyBodyPipe } from '@common/pipes/not-empty.pipe';

@Controller('productTypes')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @Get()
  async findAll(@Query() query: FindQueryDto) {
    return await this.typesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param() params: IdMongoParamsDto) {
    return await this.typesService.findOne(params.id);
  }

  @Post()
  async create(@Body() category: CreateTypeDto) {
    return await this.typesService.create(category);
  }

  @Patch(':id')
  async update(@Param() params: IdMongoParamsDto, @Body(NotEmptyBodyPipe) category: UpdateTypeDto) {
    return await this.typesService.update(params.id, category);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param() params: IdMongoParamsDto) {
    await this.typesService.delete(params.id);
    return;
  }
}
