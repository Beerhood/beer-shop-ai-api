import { Test } from '@nestjs/testing';
import { MockProxy, mock, mockReset } from 'jest-mock-extended';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';
import { Type } from '@common/models';
import { ProductTypes } from '@utils/enums';

describe('TypesController', () => {
  let typesController: TypesController;
  let typesService: MockProxy<TypesService>;

  const productTypes: Type[] = [
    { name: 'beer', productType: ProductTypes.BEER },
    { name: 'snack', productType: ProductTypes.SNACK },
  ];

  beforeAll(async () => {
    typesService = mock<TypesService>();

    const typesRef = await Test.createTestingModule({
      controllers: [TypesController],
      providers: [
        {
          provide: TypesService,
          useValue: typesService,
        },
      ],
    }).compile();

    typesController = typesRef.get(TypesController);
  });

  beforeEach(() => {
    mockReset(typesService);
  });

  describe('findAll', () => {
    it('should return all product types', async () => {
      const res = {
        items: productTypes,
        totalCount: productTypes.length,
      };
      typesService.findAll.mockResolvedValue(res);

      expect(await typesController.findAll({})).toEqual(res);
    });
  });

  describe('findOne', () => {
    it('should return one product type', async () => {
      const res = productTypes[0];
      const id = 'id';
      typesService.findOne.mockResolvedValue(res);

      expect(await typesController.findOne({ id })).toEqual(res);
    });
  });

  describe('create', () => {
    it('should create and return a product type', async () => {
      const res = productTypes[0];
      typesService.create.mockResolvedValue(res);

      expect(await typesController.create(res)).toEqual(res);
    });
  });

  describe('update', () => {
    it('should update and return one product type', async () => {
      const res = productTypes[0];
      const id = 'id';
      typesService.update.mockResolvedValue(res);

      expect(await typesController.update({ id }, res)).toEqual(res);
    });
  });

  describe('delete', () => {
    it('should delete one product type', async () => {
      const id = 'id';
      typesService.delete.mockResolvedValue(undefined);

      expect(await typesController.delete({ id })).toBeUndefined();
    });
  });
});
