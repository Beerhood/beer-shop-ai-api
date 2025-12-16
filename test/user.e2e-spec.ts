import request from 'supertest';
import { User } from '@common/models';
import { CleanUndefinedPipe } from '@common/pipes/clean-undefined.pipe';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { USERS } from '@utils/constants/db-entity-names';
import { ENVIRONMENT } from '@utils/constants/env';
import { getDBConnection } from '@utils/db';
import { UserRoles } from '@utils/enums';
import cookieParser from 'cookie-parser';
import { Connection, Model, Types } from 'mongoose';
import { Server } from 'node:http';
import { AppModule } from 'src/app.module';
import { AppConfiguration } from 'src/config/configuration';
import { validationPipeConfig } from 'src/config/validation-pipe.config';
import { USER_ROUTE_PATH } from 'src/users/constants/user.const';
import { AuthService } from 'src/auth/auth.service';
import { GoogleUserPayload } from 'src/auth/interfaces/auth-payloads.interface';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { AUTH_SERVICE_TOKEN } from 'src/auth/constants/auth.const';

type DocType<T extends Record<string, any>> = T & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
type UserDoc = DocType<User>;

const user: User = {
  email: 'test@test.com',
  firstName: 'John',
  lastName: 'Doe',
  role: UserRoles.CUSTOMER,
  birthDate: new Date(),
  address: 'test',
};

describe('Users e2e', () => {
  let app: INestApplication<Server>;
  let connection: Connection;
  let userModel: Model<User>;
  let authService: AuthService;
  const baseUrl = `api/${USER_ROUTE_PATH.CONTROLLER}`;

  function getExpectedRes(u: UserDoc, updates?: UpdateUserDto) {
    const { refreshToken, ...expected } = { ...u, ...updates };
    return JSON.parse(JSON.stringify(expected)) as Omit<UserDoc, 'refreshToken'>;
  }

  async function cleanup() {
    await app.close();
    if (connection) {
      await connection.dropDatabase();
      await connection.close();
    }
  }

  async function insertUserToDb(u: User) {
    const googleUser: GoogleUserPayload = {
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName as string,
    };

    const authTokensResponse = await authService.signIn(googleUser);
    const accessToken = authTokensResponse.accessToken;

    const userRes = await userModel.findOneAndUpdate(
      { email: u.email },
      { ...u, refreshToken: authTokensResponse.refreshToken },
      {
        new: true,
      },
    );
    if (!userRes) throw Error('Error while seeding the user');
    return { user: userRes.toObject() as unknown as UserDoc, accessToken };
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
    app.useGlobalPipes(new CleanUndefinedPipe());
    app.use(cookieParser());

    const configService = app.get<ConfigService<AppConfiguration>>(ConfigService);
    const srv = configService.getOrThrow('db_srv', { infer: true });

    authService = app.get(AUTH_SERVICE_TOKEN);

    const mongooseInstance = await getDBConnection(srv, ENVIRONMENT.TEST);
    connection = mongooseInstance.connection;

    userModel = mongooseInstance.model<User>(USERS);

    await app.init();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await cleanup();
  });

  describe(`/GET ${USER_ROUTE_PATH.GET_PROFILE}`, () => {
    const endpoint = `/${baseUrl}/${USER_ROUTE_PATH.GET_PROFILE}`;

    it('should return valid user profile', async () => {
      const { user: userDoc, accessToken } = await insertUserToDb(user);

      const expected = getExpectedRes(userDoc);
      await request(app.getHttpServer())
        .get(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(expected);
        });
    });

    it('should return 401 status code if user is unauthorized', async () => {
      await request(app.getHttpServer()).get(endpoint).expect(401);
    });

    it('should return 401 status code if user is providing the wrong token', async () => {
      await request(app.getHttpServer()).get(endpoint).auth('test', { type: 'bearer' }).expect(401);
    });

    it('should return 401 status code if user is no longer exists (but has a valid token)', async () => {
      const { user: userDoc, accessToken } = await insertUserToDb(user);

      await userModel.deleteOne({ _id: userDoc._id });

      await request(app.getHttpServer())
        .get(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .expect(401);
    });
  });

  describe(`/PATCH ${USER_ROUTE_PATH.PATCH_PROFILE}`, () => {
    const endpoint = `/${baseUrl}/${USER_ROUTE_PATH.PATCH_PROFILE}`;

    it('should return updated user profile', async () => {
      const { user: userDoc, accessToken } = await insertUserToDb(user);

      const body: UpdateUserDto = {
        email: 'test1@test.com',
      };

      const expected = getExpectedRes(userDoc, body);
      await request(app.getHttpServer())
        .patch(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .send(body)
        .expect(200)
        .expect((res) => {
          const resBody = res.body as Partial<UserDoc>;
          expect(res.body).toEqual({ ...expected, updatedAt: expect.any(String) as string });

          const updatedAt = new Date(resBody?.updatedAt as unknown as string);
          expect(updatedAt).toBeInstanceOf(Date);
          expect(updatedAt.getTime()).not.toBeNaN();
        });
    });

    it('should return 400 status code if body is empty', async () => {
      const { accessToken } = await insertUserToDb(user);

      await request(app.getHttpServer())
        .patch(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .send({})
        .expect(400);
    });

    it('should return 400 status code if body is invalid', async () => {
      const { accessToken } = await insertUserToDb(user);

      await request(app.getHttpServer())
        .patch(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .send({ test: 'test' })
        .expect(400);
    });

    it('should return 401 status code if user is unauthorized', async () => {
      await request(app.getHttpServer())
        .patch(endpoint)
        .send({ email: 'test1@test.com' })
        .expect(401);
    });

    it('should return 401 status code if user is providing the wrong token', async () => {
      await request(app.getHttpServer())
        .patch(endpoint)
        .auth('test', { type: 'bearer' })
        .send({ email: 'test1@test.com' })
        .expect(401);
    });

    it('should return 404 status code if user is no longer exists (but has a valid token)', async () => {
      const { user: userDoc, accessToken } = await insertUserToDb(user);

      await userModel.deleteOne({ _id: userDoc._id });

      await request(app.getHttpServer())
        .patch(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .send({ email: 'test1@test.com' })
        .expect(401);
    });

    it('should return 409 status code if new email is already in use', async () => {
      const { accessToken } = await insertUserToDb(user);
      const { user: anotherUser } = await insertUserToDb({ ...user, email: 'test1@test.com' });

      await request(app.getHttpServer())
        .patch(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .send({ email: anotherUser.email })
        .expect(409);
    });
  });
});
