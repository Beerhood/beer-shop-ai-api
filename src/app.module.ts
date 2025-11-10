import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import * as Joi from 'joi';

const configModule = ConfigModule.forRoot({
  load: [configuration],
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().default(3000),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_TIME: Joi.string().default('6h'),
  }),
});

@Module({
  imports: [configModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
