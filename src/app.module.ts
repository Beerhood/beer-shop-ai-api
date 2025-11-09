import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { TypesModule } from './types/types.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    TypesModule,
    AiModule,
  ],
})
export class AppModule {}
