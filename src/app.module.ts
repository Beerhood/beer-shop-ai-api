import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

const configModule = ConfigModule.forRoot({
  load: [configuration],
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().default(3000),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().required(),
  }),
});

@Module({
  imports: [configModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
