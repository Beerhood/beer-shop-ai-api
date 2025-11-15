import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { TypesRepository } from './types.repository';

@Module({
  controllers: [TypesController],
  providers: [TypesService, TypesRepository],
  exports: [TypesRepository],
})
export class TypesModule {}
