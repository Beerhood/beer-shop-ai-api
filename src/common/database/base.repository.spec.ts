import mongoose, { ClientSessionOptions, Model, Query } from 'mongoose';
import BaseRepository from './base.repository';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { NONEXISTENT_RELATION_ERROR } from '@utils/constants/db-errors';
import { BadRequestException, ConflictException } from '@nestjs/common';

interface TestObj {
  name: string;
}

interface TestDoc extends TestObj {
  _id: string;
  updatedAt: Date;
  createdAt: Date;
}

class TestRepository extends BaseRepository<TestObj> {
  constructor(model: Model<TestObj>) {
    super(model);
  }
}

describe('BaseRepository', () => {
  let repository: TestRepository;
  let model: MockProxy<Model<TestObj>>;

  const data: TestObj[] = [
    {
      name: 'test 1',
    },
    {
      name: 'test 2',
    },
  ];

  const dataRes: TestDoc[] = data.map((type, i) => ({
    ...type,
    _id: ''.padStart(24, i.toString()),
    updatedAt: new Date(),
    createdAt: new Date(),
  }));

  beforeAll(() => {
    model = mock<Model<TestObj>>();

    repository = new TestRepository(model);
  });

  beforeEach(() => {
    mockReset(model);
  });

  describe('startSession', () => {
    it('should call model.startSession with options and return session', async () => {
      const options: ClientSessionOptions = { causalConsistency: true };
      const sessionMock = { id: 'mock-session' };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      model.startSession.mockResolvedValue(sessionMock as any);

      const result = await repository.startSession(options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.startSession).toHaveBeenCalledWith(options);
      expect(result).toBe(sessionMock);
    });
  });

  describe('distinct', () => {
    it('should call model.distinct with field and filter', async () => {
      const field = 'category';
      const filter = { isActive: true };
      const expectedResult = ['beer', 'snack'];

      model.distinct.mockResolvedValue(expectedResult);

      const result = await repository.distinct(field, filter);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.distinct).toHaveBeenCalledWith(field, filter);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('aggregate', () => {
    it('should call model.aggregate with pipeline and options', async () => {
      const pipeline = [
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ];
      const options = { allowDiskUse: true };
      const expectedResult = [{ _id: 'A', count: 10 }];

      model.aggregate.mockResolvedValue(expectedResult);

      const result = await repository.aggregate(pipeline, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.aggregate).toHaveBeenCalledWith(pipeline, options);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createOne', () => {
    it('should create a single document successfully', async () => {
      const docInput = data[0];
      const createdDoc = dataRes[0];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      model.create.mockResolvedValue(createdDoc as any);

      const result = await repository.createOne(docInput);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.create).toHaveBeenCalledWith(docInput);
      expect(result).toEqual(createdDoc);
    });

    it('should handle errors using MongooseErrorHandle', async () => {
      const docInput = data[0];
      const error = new Error('Database error');

      model.create.mockRejectedValue(error);

      await expect(repository.createOne(docInput)).rejects.toThrow(error);
    });
  });

  describe('createMany', () => {
    it('should create a multiple document successfully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      model.create.mockResolvedValue(dataRes as any);

      const result = await repository.createMany(data);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.create).toHaveBeenCalledWith(data, undefined);
      expect(result).toEqual(dataRes);
    });

    it('should handle errors using MongooseErrorHandle', async () => {
      const error = new Error('Database error');

      model.create.mockRejectedValue(error);

      await expect(repository.createMany(data)).rejects.toThrow(error);
    });
  });

  describe('insertMany', () => {
    it('should insert multiple documents successfully', async () => {
      const options = { ordered: false };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      model.insertMany.mockResolvedValue(dataRes as any);

      const result = await repository.insertMany(data, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.insertMany).toHaveBeenCalledWith(data, options);
      expect(result).toEqual(dataRes);
    });
  });

  describe('find', () => {
    let queryMock: MockProxy<Query<any, any>>;

    beforeEach(() => {
      queryMock = mock<Query<any, any>>();

      queryMock.sort.mockReturnThis();
      queryMock.skip.mockReturnThis();
      queryMock.limit.mockReturnThis();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      model.find.mockReturnValue(queryMock as any);
    });

    it('should build a complete query with filter, sort, skip, limit, and projection', () => {
      const filter = { name: 'test' };
      const search = { description: 'desc' };
      const sort = { name: 1 };
      const limit = 10;
      const skip = 5;
      const projection = 'name';
      const options = { lean: true };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = repository.find(filter, sort as any, limit, skip, search, projection, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.find).toHaveBeenCalledWith({ ...filter, ...search }, projection, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryMock.sort).toHaveBeenCalledWith(sort);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryMock.skip).toHaveBeenCalledWith(skip);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryMock.limit).toHaveBeenCalledWith(limit);

      expect(result).toBe(queryMock);
    });

    it('should not call skip and limit if they are not provided', () => {
      repository.find({}, {}, undefined, undefined);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.find).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryMock.sort).toHaveBeenCalled();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryMock.skip).not.toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryMock.limit).not.toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('should call model.countDocuments with merged filter and search', async () => {
      const filter = { isActive: true };
      const search = { name: 'test' };
      const options = { limit: 100 };
      const expectedCount = data.length;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      model.countDocuments.mockResolvedValue(expectedCount as any);

      const result = await repository.count(filter, search, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.countDocuments).toHaveBeenCalledWith({ ...filter, ...search }, options);
      expect(result).toBe(expectedCount);
    });
  });

  describe('findOne', () => {
    it('should call model.findOne with correct params', async () => {
      const conditions = { name: 'test 1' };
      const projection = { name: 1 };
      const options = { lean: true };
      const expectedDoc = dataRes[0];

      model.findOne.mockResolvedValue(expectedDoc);

      const result = await repository.findOne(conditions, projection, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.findOne).toHaveBeenCalledWith(conditions, projection, options);
      expect(result).toEqual(expectedDoc);
    });
  });

  describe('findById', () => {
    it('should call model.findById with correct params', async () => {
      const id = 'id';
      const projection = 'password';
      const options = { lean: true };
      const expectedDoc = dataRes[0];

      model.findById.mockResolvedValue(expectedDoc);

      const result = await repository.findById(id, projection, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.findById).toHaveBeenCalledWith(id, projection, options);
      expect(result).toEqual(expectedDoc);
    });
  });

  describe('updateOne', () => {
    it('should call model.updateOne and return execution result', async () => {
      const filter = { _id: 'id' };
      const update = { name: 'updated' };
      const options = { new: true };

      const updateResult = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      model.updateOne.mockResolvedValue(updateResult as any);

      const result = await repository.updateOne(filter, update, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.updateOne).toHaveBeenCalledWith(filter, update, options);
      expect(result).toEqual(updateResult);
    });

    it('should handle errors', async () => {
      const filter = { _id: 'id' };
      const update = { name: 'error' };
      const error = new Error('Update failed');

      model.updateOne.mockRejectedValue(error);

      await expect(repository.updateOne(filter, update)).rejects.toThrow(error);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should call findByIdAndUpdate with "new: true" option', async () => {
      const id = 'id';
      const update = { name: 'Updated Name' };
      const options = { lean: true };
      const expectedDoc = { ...dataRes[0], ...update };

      model.findByIdAndUpdate.mockResolvedValue(expectedDoc);

      const result = await repository.findByIdAndUpdate(id, update, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(id, update, {
        ...options,
        new: true,
      });
      expect(result).toEqual(expectedDoc);
    });

    it('should propagate errors', async () => {
      const id = 'id';
      const update = { name: 'Val' };
      const error = new Error('Update failed');

      model.findByIdAndUpdate.mockRejectedValue(error);

      await expect(repository.findByIdAndUpdate(id, update)).rejects.toThrow(error);
    });
  });

  describe('updateMany', () => {
    it('should call updateMany and return result', async () => {
      const filter = { isActive: false };
      const update = { isActive: true };
      const updateResult = {
        acknowledged: true,
        modifiedCount: 5,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 5,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      model.updateMany.mockResolvedValue(updateResult as any);

      const result = await repository.updateMany(filter, update);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.updateMany).toHaveBeenCalledWith(filter, update, undefined);
      expect(result).toEqual(updateResult);
    });

    it('should propagate errors', async () => {
      const error = new Error('Update Many failed');
      model.updateMany.mockRejectedValue(error);

      await expect(repository.updateMany({}, {})).rejects.toThrow(error);
    });
  });

  describe('deleteOne', () => {
    it('should call deleteOne with correct params', async () => {
      const filter = { _id: 'id' };
      const options = { session: null };
      const deleteResult = { acknowledged: true, deletedCount: 1 };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      model.deleteOne.mockResolvedValue(deleteResult as any);

      const result = await repository.deleteOne(filter, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.deleteOne).toHaveBeenCalledWith(filter, options);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('deleteMany', () => {
    it('should call deleteMany with correct params', async () => {
      const conditions = { isActive: false };
      const options = {};
      const deleteResult = { acknowledged: true, deletedCount: 10 };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      model.deleteMany.mockResolvedValue(deleteResult as any);

      const result = await repository.deleteMany(conditions, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.deleteMany).toHaveBeenCalledWith(conditions, options);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('MongooseErrorHandle', () => {
    it('should throw ConflictException when validation error is NONEXISTENT_RELATION_ERROR', () => {
      const validationError = new mongoose.Error.ValidationError();

      validationError.errors = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        someField: {
          kind: NONEXISTENT_RELATION_ERROR,
          message: 'Relation does not exist',
        } as any,
      };

      expect(() => repository.MongooseErrorHandle(validationError)).toThrow(ConflictException);
    });

    it('should throw BadRequestException for other Mongoose Validation Errors', () => {
      const validationError = new mongoose.Error.ValidationError();
      validationError.errors = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        someField: {
          kind: 'required',
          message: 'Field is required',
        } as any,
      };

      expect(() => repository.MongooseErrorHandle(validationError)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for Mongoose Errors', () => {
      const mongooseError = new mongoose.Error('Some DB error');

      expect(() => repository.MongooseErrorHandle(mongooseError)).toThrow(BadRequestException);
    });

    it('should re-throw standard JavaScript Errors', () => {
      const error = new Error('Something went wrong in logic');

      expect(() => repository.MongooseErrorHandle(error)).toThrow(error);
    });

    it('should wrap unknown objects into Error', () => {
      const unknownError = 'Just a string error';

      expect(() => repository.MongooseErrorHandle(unknownError)).toThrow(Error);

      try {
        repository.MongooseErrorHandle(unknownError);
      } catch (e) {
        expect((e as Error).message).toBe(unknownError);
      }
    });
  });

  describe('toObject', () => {
    it('should return null if data is null or undefined', () => {
      expect(repository.toObject(null)).toBeNull();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(repository.toObject(undefined as any)).toBeNull();
    });

    it('should convert a single HydratedDocument to object', () => {
      const plainData = data[0];
      const docMock = {
        toObject: jest.fn().mockReturnValue(plainData),
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = repository.toObject(docMock as any);

      expect(docMock.toObject).toHaveBeenCalled();
      expect(result).toEqual(plainData);
    });

    it('should convert an array of HydratedDocuments', () => {
      const plainData1 = data[0];
      const plainData2 = data[1];

      const docMock1 = { toObject: jest.fn().mockReturnValue(plainData1) };
      const docMock2 = { toObject: jest.fn().mockReturnValue(plainData2) };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = repository.toObject([docMock1, docMock2] as any);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result).toEqual([plainData1, plainData2]);

      expect(docMock1.toObject).toHaveBeenCalled();
      expect(docMock2.toObject).toHaveBeenCalled();
    });
  });
});
