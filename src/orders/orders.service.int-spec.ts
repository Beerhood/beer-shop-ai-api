import { Test } from '@nestjs/testing';
import { OrdersModule } from './orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_FILES, ENVIRONMENT } from '@utils/constants/env';
import configuration from 'src/config/configuration';
import { envValidationSchema } from 'src/config/env.schema';
import { Connection, Model, Types } from 'mongoose';
import { getDBConnection } from '@utils/db';
import { OrdersService } from './orders.service';
import { Order, Product, User, Type, ProductInOrder } from '@common/models';
import { ORDERS, PRODUCTS, TYPES, USERS } from '@utils/constants/db-entity-names';
import { OrderStatuses, ProductTypes, UserRoles } from '@utils/enums';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import Decimal from 'decimal.js';

type DocType<T extends Record<string, any>> = T & { _id: Types.ObjectId };
type UserDoc = DocType<User>;
type ProductDoc = DocType<Product>;
type OrderDoc = DocType<Order>;
type TypeDoc = DocType<Type>;

describe('Orders integration', () => {
  let connection: Connection;
  let ordersService: OrdersService;
  let orderModel: Model<Order>;
  let productModel: Model<Product>;
  let userModel: Model<User>;
  let typeModel: Model<Type>;
  let userDocs: UserDoc[];
  let productDocs: ProductDoc[];
  let typeDocs: TypeDoc[];

  const invalidId = '12345678901234567890abcd';

  const users: User[] = [
    {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRoles.CUSTOMER,
      birthDate: new Date(),
      address: 'test',
    },
    {
      email: 'test1@test.com',
      firstName: 'John 1',
      lastName: 'Doe 1',
      role: UserRoles.CUSTOMER,
      birthDate: new Date(),
      address: 'test 1',
    },
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

  const types: Type[] = [
    {
      name: 'beer',
      productType: ProductTypes.BEER,
    },
    { name: 'snack', productType: ProductTypes.SNACK },
  ];

  const orders: Order[] = [
    {
      user: '',
      products: [{ item: '', count: 1 }],
      address: 'test',
      totalPrice: 1,
      status: OrderStatuses.PENDING,
    },
    {
      user: '',
      products: [{ item: '', count: 1 }],
      address: 'test 1',
      totalPrice: 1,
      status: OrderStatuses.PENDING,
    },
    {
      user: '',
      products: [
        { item: '', count: 1 },
        { item: '', count: 1 },
        { item: '', count: 1 },
      ],
      address: 'test 2',
      totalPrice: 5,
      status: OrderStatuses.PENDING,
    },
  ];

  async function cleanup() {
    if (connection) {
      await connection.dropDatabase();
      await connection.close();
    }
  }

  async function seedData() {
    userDocs = await userModel.insertMany(users);
    if (userDocs.length !== users.length) throw Error('Error while seeding the users');

    typeDocs = await typeModel.insertMany(types);
    if (typeDocs.length !== types.length) throw Error('Error while seeding the product types');

    products.forEach((product) => {
      const type = typeDocs.find((t) => t.productType === product.productType);
      product.type = type ? type._id : '';
    });

    productDocs = await productModel.insertMany(products);
    if (productDocs.length !== products.length) throw Error('Error while seeding the products');

    orders.forEach((order, i) => {
      // The first user has 2nd and 3d orders and the second - 1st
      const user = userDocs.find((u) => u.email === (i === 0 ? users[1] : users[0]).email);
      order.user = user ? user._id : '';

      order.products.forEach((product, i) => {
        // Order: odd products are beer and even - snack
        const prod = productDocs.find(
          (p) => p.title === (i % 2 === 0 ? products[0] : products[1]).title,
        );
        product.item = prod ? prod._id : '';
      });
    });
  }

  function getOrderTotalPrice(productIds: ProductInOrder[]): number {
    const totalPrice = productIds.reduce((acc, productId) => {
      const product = productDocs.find((p) => p._id.toString() === productId.item.toString());
      if (!product) throw Error('Error while calculating total price');
      return acc.plus(new Decimal(product.price).times(productId.count));
    }, new Decimal(0));
    return totalPrice.toDecimalPlaces(2).toNumber();
  }

  function stringifyOrderProductIds(products: ProductInOrder[]) {
    return products.map((p) => ({ ...p, item: p.item.toString() }));
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        OrdersModule,
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

    orderModel = mongooseInstance.model<Order>(ORDERS);
    productModel = mongooseInstance.model<Product>(PRODUCTS);
    userModel = mongooseInstance.model<User>(USERS);
    typeModel = mongooseInstance.model<Type>(TYPES);

    try {
      await seedData();
    } catch (error) {
      await cleanup();
      throw error;
    }

    ordersService = moduleRef.get(OrdersService);
  });

  beforeEach(async () => {
    await orderModel.deleteMany({});
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('findAll', () => {
    let userId: string | Types.ObjectId;
    let userOrderDocs: OrderDoc[];

    function getOrderRes(data: OrderDoc[], count: number) {
      return { items: data, totalCount: count };
    }

    beforeAll(() => {
      const user = userDocs.find((u) => u.email === users[0].email);
      userId = user ? user._id : ''; // Get the first user id
    });

    beforeEach(async () => {
      const orderDocs = (await orderModel.insertMany(orders)).map((o) => o.toObject());
      userOrderDocs = orderDocs.filter((order) => order.user.toString() === userId.toString());
    });

    it('should return all orders belonging to the user', async () => {
      const res = await ordersService.findAll({}, userId.toString());

      expect(res).toEqual(getOrderRes(userOrderDocs, userOrderDocs.length));
    });

    it('should filter orders by address (query testing)', async () => {
      // Get the order with index 1
      const address = orders[1].address;
      const userOrderAddressDocs = userOrderDocs.filter((o) => o.address === address);
      const res = await ordersService.findAll({ filter: { address } }, userId.toString());

      expect(res).toEqual(getOrderRes(userOrderAddressDocs, userOrderAddressDocs.length));
    });
  });

  describe('findOne', () => {
    let userId: string | Types.ObjectId;

    beforeAll(() => {
      const user = userDocs.find((u) => u.email === users[1].email);
      userId = user ? user._id : ''; // Get the second user id
    });

    it('should return order by id', async () => {
      const orderDoc = (await orderModel.create(orders[0])).toObject();

      const res = await ordersService.findOne(orderDoc._id.toString(), userId.toString());

      expect(res).toEqual(orderDoc);
    });

    it('should throw NotFoundException when order id does not exist', async () => {
      await expect(ordersService.findOne(invalidId, userId.toString())).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when trying to access order of another user', async () => {
      const orderDoc = (await orderModel.create(orders[1])).toObject();

      const resPromise = ordersService.findOne(orderDoc._id.toString(), userId.toString());

      await expect(resPromise).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    let userId: string | Types.ObjectId;

    function getOrderDocDefaultFields() {
      return {
        _id: expect.any(Types.ObjectId) as Types.ObjectId,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      };
    }

    function getOrderRes(data: Partial<Order>, totalPrice: number) {
      return {
        ...data,
        totalPrice,
        user: userId,
        status: OrderStatuses.PENDING,
        ...getOrderDocDefaultFields(),
      };
    }

    function getProductsWithoutDuplicates(products: ProductInOrder[]) {
      const map = new Map<string, number>();
      products.forEach((p) => {
        const pId = p.item.toString();
        const currentCount = map.get(pId) || 0;
        map.set(pId, currentCount + p.count);
      });

      return Array.from(map.entries()).map(([item, count]) => ({
        item,
        count,
      }));
    }

    beforeAll(() => {
      const user = userDocs.find((u) => u.email === users[0].email);
      userId = user ? user._id : ''; // Get the first user id
    });

    it('should create an order and calculate total price (without expected total)', async () => {
      const { totalPrice: t, user, status, ...dataRaw } = orders[1];
      const data = {
        ...dataRaw,
        products: stringifyOrderProductIds(dataRaw.products),
      };

      const totalPrice = getOrderTotalPrice(data.products);

      const res = await ordersService.create(data, userId.toString());
      expect(res).toEqual(expect.objectContaining(getOrderRes(dataRaw, totalPrice)));
    });

    it('should create an order and calculate total price (with expected total)', async () => {
      const { totalPrice: t, user, status, ...dataRaw } = orders[1];

      const data = { ...dataRaw, products: stringifyOrderProductIds(dataRaw.products) };

      const totalPrice = getOrderTotalPrice(data.products);

      const res = await ordersService.create(
        { ...data, expectedTotal: totalPrice },
        userId.toString(),
      );

      expect(res).toEqual(expect.objectContaining(getOrderRes(dataRaw, totalPrice)));
    });

    it('should throw ConflictException if expected total does not match calculated total', async () => {
      const { totalPrice, user, status, ...dataRaw } = orders[1];

      const data = {
        ...dataRaw,
        products: stringifyOrderProductIds(dataRaw.products),
      };

      const resPromise = ordersService.create({ ...data, expectedTotal: 0 }, userId.toString());

      await expect(resPromise).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if order has incorrect product id', async () => {
      const { totalPrice, user, status, ...dataRaw } = orders[1];
      const products = dataRaw.products.map((p) => ({ ...p, item: invalidId }));
      const data = { ...dataRaw, products };

      const resPromise = ordersService.create(data, userId.toString());

      await expect(resPromise).rejects.toThrow(ConflictException);
    });

    it('should throw UnauthorizedException if user id is not correct', async () => {
      const { totalPrice, user, status, ...dataRaw } = orders[1];

      const data = { ...dataRaw, products: stringifyOrderProductIds(dataRaw.products) };

      const resPromise = ordersService.create(data, invalidId);

      await expect(resPromise).rejects.toThrow(UnauthorizedException);
    });

    it('should create an order with product duplicates correctly processed', async () => {
      const { totalPrice: t, user, status, ...data } = orders[2];

      const productsWithoutDuplicates = getProductsWithoutDuplicates(data.products);

      const productsWithoutDuplicatesWithObjectIds = productsWithoutDuplicates.map((product) => ({
        ...product,
        item: new Types.ObjectId(product.item),
      }));

      const totalPrice = getOrderTotalPrice(productsWithoutDuplicates);
      const res = await ordersService.create(
        { ...data, products: productsWithoutDuplicates },
        userId.toString(),
      );

      expect(res).toEqual(
        expect.objectContaining({
          ...getOrderRes(data, totalPrice),
          products: productsWithoutDuplicatesWithObjectIds,
        }),
      );
    });
  });
});
