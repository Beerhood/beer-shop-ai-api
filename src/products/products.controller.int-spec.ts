import { Connection, Model, Types } from 'mongoose';
import { ProductsController } from './products.controller';
import { Test } from '@nestjs/testing';
import { ProductsModule } from './products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_FILES, ENVIRONMENT } from '@utils/constants/env';
import configuration from 'src/config/configuration';
import { envValidationSchema } from 'src/config/env.schema';
import { getDBConnection } from '@utils/db';
import { Product, Type } from '@common/models';
import { PRODUCTS, TYPES } from '@utils/constants/db-entity-names';
import { ProductTypes } from '@utils/enums';
import { BadRequestException, NotFoundException } from '@nestjs/common';

type LeanType = Type & { _id: Types.ObjectId };

describe('Product integration', () => {
  let connection: Connection;
  let productsController: ProductsController;
  let productModel: Model<Product>;
  let typeModel: Model<Type>;
  let typesDoc: LeanType[];

  const types: Type[] = [
    {
      name: 'beer',
      productType: ProductTypes.BEER,
    },
    { name: 'snack', productType: ProductTypes.SNACK },
  ];

  const products: Product[] = [
    {
      title: 'beer',
      image: 'test',
      description: 'test',
      type: '',
      price: 1,
      productType: ProductTypes.BEER,
      brand: 'test',
      country: 'test',
      details: { ABV: 5.0, IBU: 5, OG: 1.0, style: 'test' },
    },
    {
      title: 'snack',
      image: 'test 1',
      description: 'test 1',
      type: '',
      price: 2,
      productType: ProductTypes.SNACK,
      brand: 'test 1',
      country: 'test 1',
      details: { flavor: 'test' },
    },
  ];

  const invalidId = '12345678901234567890abcd';

  async function cleanup() {
    if (connection) {
      await connection.dropDatabase();
      await connection.close();
    }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ProductsModule,
        ConfigModule.forRoot({
          envFilePath: ENV_FILES.TEST,
          load: [configuration],
          isGlobal: true,
          validationSchema: envValidationSchema,
        }),
      ],
    }).compile();

    const configService = moduleRef.get<ConfigService>(ConfigService);
    const srv = configService.getOrThrow<string>('db_srv');

    const mongooseInstance = await getDBConnection(srv, ENVIRONMENT.TEST);
    connection = mongooseInstance.connection;

    productModel = mongooseInstance.model<Product>(PRODUCTS);
    typeModel = mongooseInstance.model<Type>(TYPES);

    try {
      typesDoc = await typeModel.insertMany(types);
      if (typesDoc.length !== types.length) throw Error('Error while seeding the types');

      products.forEach((product) => {
        const type = typesDoc.find((t) => t.productType === product.productType);
        product.type = type ? type._id : '';
      });
    } catch (error) {
      await cleanup();
      throw error;
    }

    productsController = moduleRef.get(ProductsController);
  });

  beforeEach(async () => {
    await productModel.deleteMany({});
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('findAll', () => {
    it('should pass if returned many products', async () => {
      const productDocs = (await productModel.insertMany(products)).map((p) => p.toObject());
      const expected = productDocs.map((product) => {
        const newProd = {
          ...product,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          type: expect.objectContaining({ _id: product.type }),
        };
        return newProd;
      });

      const res = await productsController.findAll({});

      expect(res).toEqual({ items: expected, totalCount: productDocs.length });
    });

    it('should pass if returned products with type beer (query testing)', async () => {
      const productDocs = (await productModel.insertMany(products)).map((p) => p.toObject());
      const beerDocs = productDocs.filter((p) => p.productType === ProductTypes.BEER);
      const expected = beerDocs.map((product) => {
        const newProd = {
          ...product,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          type: expect.objectContaining({ _id: product.type }),
        };
        return newProd;
      });

      const res = await productsController.findAll({ filter: { productType: ProductTypes.BEER } });

      expect(res).toEqual({ items: expected, totalCount: beerDocs.length });
    });
  });

  describe('findOne', () => {
    it('should pass when found product by id', async () => {
      const productDoc = (await productModel.create(products[0])).toObject();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const expected = { ...productDoc, type: expect.objectContaining({ _id: productDoc.type }) };

      const res = await productsController.findOne({ id: productDoc._id.toString() });

      expect(res).toEqual(expected);
    });

    it('should pass if throw NotFoundException when product not found', async () => {
      await expect(productsController.findOne({ id: invalidId })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should pass if product is created', async () => {
      const data = products[0];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await productsController.create(data as any);

      expect(res).toEqual(
        expect.objectContaining({
          ...data,
          _id: expect.any(Types.ObjectId) as Types.ObjectId,
          createdAt: expect.any(Date) as Date,
          updatedAt: expect.any(Date) as Date,
        }),
      );
    });

    it('should pass if product with unexisting type is not created', async () => {
      const data: Product = { ...products[0], type: invalidId };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const resPromise = productsController.create(data as any);

      await expect(resPromise).rejects.toThrow(NotFoundException);
    });

    it('should pass if product with wrong type is not created', async () => {
      const snackType = typesDoc.find((t) => t.productType === ProductTypes.SNACK);
      const data: Product = {
        ...products[0],
        type: snackType ? snackType._id.toString() : '',
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const resPromise = productsController.create(data as any);

      await expect(resPromise).rejects.toThrow(BadRequestException);
    });
  });
});
