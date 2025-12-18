import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';
import { ProductTypes } from '../../src/utils/enums';
import { CONTEXT_FILE } from './constants';
import * as fs from 'fs';
import { getDBConnection } from '@utils/db';
import { AUTH_SERVICE_TOKEN } from 'src/auth/constants/auth.const';
import { AppConfiguration } from 'src/config/configuration';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT } from '@utils/constants/env';
import { Product, Type } from '@common/models';
import { PRODUCTS, TYPES } from '@utils/constants/db-entity-names';
import { faker } from '@faker-js/faker';
import { Model, Types } from 'mongoose';

const CONFIG = {
  BEERS_COUNT: 2000,
  SNACKS_COUNT: 1000,
  CATEGORIES_COUNT: 200,
  BATCH_SIZE: 50,
};

function generateBeer(typeId: Types.ObjectId) {
  return {
    title: `${faker.commerce.productAdjective()} ${faker.animal.type()} Beer ${faker.string.alphanumeric(5)}`,
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 5, max: 25 })),
    image: faker.image.urlPicsumPhotos(),
    brand: faker.company.name(),
    country: faker.location.country(),
    productType: ProductTypes.BEER,
    type: typeId,
    details: {
      style: faker.helpers.arrayElement(['IPA', 'Stout', 'Lager', 'Porter', 'Ale']),
      ABV: faker.number.float({ min: 3, max: 12, multipleOf: 0.1 }),
      IBU: faker.number.int({ min: 10, max: 100 }),
      OG: faker.number.float({ min: 1.03, max: 1.1, multipleOf: 0.001 }),
    },
  };
}

function generateSnack(typeId: Types.ObjectId) {
  return {
    title: `${faker.commerce.productAdjective()} ${faker.word.noun()} ${faker.string.alphanumeric(5)}`,
    description: faker.lorem.sentence(),
    price: parseFloat(faker.commerce.price({ min: 2, max: 15 })),
    image: faker.image.urlPicsumPhotos(),
    brand: faker.company.name(),
    country: faker.location.country(),
    productType: ProductTypes.SNACK,
    type: typeId,
    details: {
      flavor: faker.helpers.arrayElement(['Spicy', 'Salty', 'Cheesy', 'BBQ']),
    },
  };
}

function generateCategory() {
  return {
    name: `${faker.commerce.productAdjective()} ${faker.word.noun()} ${faker.string.alphanumeric(5)}`,
    productType: faker.helpers.enumValue(ProductTypes),
  };
}

async function insertInBatches<T>(
  model: Model<T>,
  totalCount: number,
  label: string,
  generator: (id: Types.ObjectId) => any,
  typeId: Types.ObjectId,
): Promise<void>;
async function insertInBatches<T>(
  model: Model<T>,
  totalCount: number,
  label: string,
  generator: () => any,
): Promise<void>;
async function insertInBatches<T>(
  model: Model<T>,
  totalCount: number,
  label: string,
  generator: (id?: any) => object,
  typeId?: Types.ObjectId,
) {
  console.log(`Starting seeding ${label}: ${totalCount} items...`);

  for (let i = 0; i < totalCount; i += CONFIG.BATCH_SIZE) {
    const currentBatchSize = Math.min(CONFIG.BATCH_SIZE, totalCount - i);

    const batch = Array.from({ length: currentBatchSize }).map(() =>
      typeId ? generator(typeId) : generator(),
    );
    await model.insertMany(batch, { ordered: false });

    process.stdout.write(`\rProgress ${label}: ${i + currentBatchSize} / ${totalCount}`);
  }
  console.log(`\nFinished seeding ${label}.`);
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  const authService = app.get<AuthService>(AUTH_SERVICE_TOKEN);

  const configService = app.get<ConfigService<AppConfiguration>>(ConfigService);
  const srv = configService.getOrThrow('db_srv', { infer: true });

  const mongooseInstance = await getDBConnection(srv, ENVIRONMENT.TEST);
  const connection = mongooseInstance.connection;

  if (!connection.db) {
    throw new Error('Database connection is not established');
  }

  const typeModel = mongooseInstance.model<Type>(TYPES);
  const productModel = mongooseInstance.model<Product>(PRODUCTS);

  console.log('Cleaning DB...');
  await Promise.all(
    Object.values(connection.collections).map((collection) => collection.deleteMany({})),
  );

  const beerType = await typeModel.create({
    name: 'Beer',
    productType: ProductTypes.BEER,
  });
  const snackType = await typeModel.create({
    name: 'Snack',
    productType: ProductTypes.SNACK,
  });

  await insertInBatches(productModel, CONFIG.BEERS_COUNT, 'Beers', generateBeer, beerType._id);
  await insertInBatches(productModel, CONFIG.SNACKS_COUNT, 'Snacks', generateSnack, snackType._id);

  await insertInBatches(typeModel, CONFIG.CATEGORIES_COUNT, 'Categories', generateCategory);

  const userPayload = {
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const tokens = await authService.signIn(userPayload);

  const envContent = `TEST_AUTH_TOKEN=${tokens.accessToken}`;
  fs.writeFileSync(CONTEXT_FILE, envContent);
  console.log(`Auth token successfully saved to: ${CONTEXT_FILE}`);

  await connection.db.command({ profile: 2, slowms: 5 });
  console.log('Mongo Profiling Enabled');

  await app.close();
  await mongooseInstance.disconnect();
}

bootstrap().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
