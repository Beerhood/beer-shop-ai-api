import { forwardRef, Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { TypesRepository } from './types.repository';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  controllers: [TypesController],
  providers: [TypesService, TypesRepository],
  exports: [TypesService, TypesRepository],
})
export class TypesModule {}
