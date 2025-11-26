import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import * as Joi from 'joi';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { TypesModule } from './types/types.module';
import { AiModule } from './ai/ai.module';
import { APP_PIPE } from '@nestjs/core';
import { CleanUndefinedPipe } from '@common/pipes/clean-undefined.pipe';
import { ParseQueryPipe } from '@common/pipes/parse-query.pipe';

const configModule = ConfigModule.forRoot({
  load: [configuration],
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().required(),
    CLIENT_URL: Joi.string().uri().required(),
    DB_SRV: Joi.string().required(),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().required(),
    GROQ_API_KEY: Joi.string().required(),
  }),
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
