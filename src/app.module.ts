import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { TypesModule } from './types/types.module';
import { AiModule } from './ai/ai.module';
import { APP_PIPE } from '@nestjs/core';
import { CleanUndefinedPipe } from '@common/pipes/clean-undefined.pipe';
import { ParseQueryPipe } from '@common/pipes/parse-query.pipe';
import { ENV_FILES, ENVIRONMENT } from '@utils/constants/env';
import { envValidationSchema } from './config/env.schema';

const configModule = ConfigModule.forRoot({
  envFilePath: process.env.NODE_ENV === ENVIRONMENT.TEST ? ENV_FILES.TEST : ENV_FILES.ENV,
  load: [configuration],
  isGlobal: true,
  validationSchema: envValidationSchema,
});

@Module({
  controllers: [],
  providers: [
    { provide: APP_PIPE, useClass: CleanUndefinedPipe },
    { provide: APP_PIPE, useClass: ParseQueryPipe },
  ],
  imports: [
    configModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    TypesModule,
    AiModule,
  ],
})
export class AppModule {}
