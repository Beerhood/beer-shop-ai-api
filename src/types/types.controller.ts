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
  UseGuards,
} from '@nestjs/common';
import { TypesService } from './types.service';
import { FindQueryDto } from '@common/dto/query/find-query.dto';
import { IdMongoParamsDto } from '@common/dto/params/id-params.dto';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { NotEmptyBodyPipe } from '@common/pipes/not-empty.pipe';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles } from '@utils/enums';
import { RolesGuard } from 'src/auth/guards/roles.guard';

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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.ADMIN)
  async create(@Body() category: CreateTypeDto) {
    return await this.typesService.create(category);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.ADMIN)
  async update(@Param() params: IdMongoParamsDto, @Body(NotEmptyBodyPipe) category: UpdateTypeDto) {
    return await this.typesService.update(params.id, category);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.ADMIN)
  async delete(@Param() params: IdMongoParamsDto) {
    await this.typesService.delete(params.id);
    return;
  }
}
