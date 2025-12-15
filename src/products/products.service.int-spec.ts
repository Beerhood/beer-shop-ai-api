import { Connection, Model, Types } from 'mongoose';
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
import { ProductsService } from './products.service';

type DocType<T extends Record<string, any>> = T & { _id: Types.ObjectId };
type ProductDoc = DocType<Product>;
type TypeDoc = DocType<Type>;

describe('Products integration', () => {
  let connection: Connection;
  let productsService: ProductsService;
  let productModel: Model<Product>;
  let typeModel: Model<Type>;
  let typesDoc: TypeDoc[];

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

  async function seedData() {
    typesDoc = await typeModel.insertMany(types);
    if (typesDoc.length !== types.length) throw Error('Error while seeding the types');

    products.forEach((product) => {
      const type = typesDoc.find((t) => t.productType === product.productType);
      product.type = type ? type._id : '';
    });
  }

  function getExpectedProduct(doc: ProductDoc) {
    return {
      ...doc,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: expect.objectContaining({ _id: doc.type }),
    };
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
      await seedData();
    } catch (error) {
      await cleanup();
      throw error;
    }

    productsService = moduleRef.get(ProductsService);
  });

  beforeEach(async () => {
    await productModel.deleteMany({});
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('findAll', () => {
    let productDocs: ProductDoc[];

    function getProductRes(data: ProductDoc[], count: number) {
      return { items: data, totalCount: count };
    }

    beforeEach(async () => {
      productDocs = (await productModel.insertMany(products)).map((p) => p.toObject());
    });

    it('should return all products', async () => {
      const expected = productDocs.map((product) => getExpectedProduct(product));

      const res = await productsService.findAll({});

      expect(res).toEqual(getProductRes(expected, expected.length));
    });

    it('should filter products of type "beer" (query testing)', async () => {
      const beerDocs = productDocs.filter((p) => p.productType === ProductTypes.BEER);
      const expected = beerDocs.map((product) => getExpectedProduct(product));

      const res = await productsService.findAll({ filter: { productType: ProductTypes.BEER } });

      expect(res).toEqual(getProductRes(expected, expected.length));
    });
  });

  describe('findOne', () => {
    it('should return product by id', async () => {
      const productDoc = (await productModel.create(products[0])).toObject();
      const expected = getExpectedProduct(productDoc);

      const res = await productsService.findOne(productDoc._id.toString());

      expect(res).toEqual(expected);
    });

    it('should throw NotFoundException when product id does not exist', async () => {
      await expect(productsService.findOne(invalidId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    function getProductDocDefaultFields() {
      return {
        _id: expect.any(Types.ObjectId) as Types.ObjectId,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      };
    }

    function getProductRes(data: Product) {
      return {
        ...data,
        ...getProductDocDefaultFields(),
      };
    }

    it('should create a product', async () => {
      const data = { ...products[0] };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await productsService.create(data as any);

      expect(res).toEqual(expect.objectContaining(getProductRes(data)));
    });

    it('should throw NotFoundException if product type id is invalid', async () => {
      const data: Product = { ...products[0], type: invalidId };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const resPromise = productsService.create(data as any);

      await expect(resPromise).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if product type is wrong ("beer" while expecting "snack")', async () => {
      const snackType = typesDoc.find((t) => t.productType === ProductTypes.SNACK);
      const data: Product = {
        ...products[0],
        type: snackType ? snackType._id.toString() : '',
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const resPromise = productsService.create(data as any);

      await expect(resPromise).rejects.toThrow(BadRequestException);
    });
  });
});
