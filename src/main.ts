import cors from 'cors';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { getDBConnection } from '@utils/db';
import { expandValidationError } from '@utils/errors/expand-validation-error';
import { CleanUndefinedPipe } from '@common/pipes/clean-undefined.pipe';
import { ParseQueryPipe } from '@common/pipes/parse-query.pipe';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const client = configService.getOrThrow<string>('client');

  app.useGlobalPipes(new ParseQueryPipe());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        throw new BadRequestException({
          error: 'Validation Error',
          statusCode: HttpStatus.BAD_REQUEST,
          details: errors.map(expandValidationError),
        });
      },
    }),
  );

  app.useGlobalPipes(new CleanUndefinedPipe());

  app.setGlobalPrefix('api');

  app.use(cors({ origin: client, credentials: true }));

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Beerhood API')
    .setDescription('The Beerhood e-commerce platform API documentation')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const srv = configService.getOrThrow<string>('db_srv');
  const nodeEnv = configService.getOrThrow<string>('nodeEnv');

  await getDBConnection(srv, nodeEnv);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch(() => {
  process.exit(1);
});
