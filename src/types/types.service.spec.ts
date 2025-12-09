import { MockProxy, mockReset, mock } from 'jest-mock-extended';
import { TypesService } from './types.service';
import { TypesRepository } from './types.repository';
import { Test } from '@nestjs/testing';
import { ProductTypes } from '@utils/enums';
import { Type } from '@common/models';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from 'src/products/products.repository';

describe('TypesService', () => {
  let typesService: TypesService;
  let typesRepository: MockProxy<TypesRepository>;
  let productsRepository: MockProxy<ProductsRepository>;

  const productTypes: Type[] = [
    { name: 'beer', productType: ProductTypes.BEER },
    { name: 'snack', productType: ProductTypes.SNACK },
  ];

  beforeAll(async () => {
    typesRepository = mock<TypesRepository>();
    productsRepository = mock<ProductsRepository>();

    const typesRef = await Test.createTestingModule({
      providers: [
        TypesService,
        { provide: TypesRepository, useValue: typesRepository },
        { provide: ProductsRepository, useValue: productsRepository },
      ],
    }).compile();

    typesService = typesRef.get(TypesService);
  });

  beforeEach(() => {
    mockReset(typesRepository);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typesRepository.toObject.mockImplementation((object: any) => object);
  });

  describe('findAll', () => {
    it('should return product types with totalCount', async () => {
      const res = { items: productTypes, totalCount: productTypes.length };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      typesRepository.find.mockResolvedValue(res.items as any);
      typesRepository.count.mockResolvedValue(res.totalCount);

      expect(await typesService.findAll({})).toEqual(res);
    });
  });

  describe('findOne', () => {
    it('should return one product type', async () => {
      const res = productTypes[0];
      const id = 'id';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      typesRepository.findById.mockResolvedValue(res as any);

      expect(await typesService.findOne(id)).toEqual(res);
    });

    it('should throw Not Found error if type not found', async () => {
      const id = 'id';
      typesRepository.findById.mockResolvedValue(null);

      await expect(typesService.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return one product type', async () => {
      const res = productTypes[0];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      typesRepository.createOne.mockResolvedValue(res as any);

      expect(await typesService.create(res)).toEqual(res);
    });
  });

  describe('update', () => {
    it('should update and return one product type', async () => {
      const req = productTypes[0];
      const data = { ...req };
      const res = { ...data, ...req };
      const id = 'id';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      typesRepository.findById.mockResolvedValue(data as any);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      typesRepository.findByIdAndUpdate.mockResolvedValue(res as any);

      expect(await typesService.update(id, req)).toEqual(res);
    });

    it('should throw Not Found error if type not found while updating', async () => {
      const req = productTypes[0];
      const id = 'id';
      typesRepository.findById.mockResolvedValue(null);
      typesRepository.findByIdAndUpdate.mockResolvedValue(null);

      await expect(typesService.update(id, req)).rejects.toThrow(NotFoundException);
    });

    it("should update and return one type when changing type's productType (with no referenced products)", async () => {
      const req = productTypes[0];
      const data = { ...req, productTypes: ProductTypes.SNACK };
      const res = { ...data, ...req };
      const id = 'id';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      typesRepository.findById.mockResolvedValue(data as any);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      typesRepository.findByIdAndUpdate.mockResolvedValue(res as any);
      productsRepository.findOneByCategory.mockResolvedValue(null);

      expect(await typesService.update(id, req)).toEqual(res);
    });

    it("should throw Conflict error when changing type's productType (with at least 1 referenced product)", async () => {
      const req = productTypes[0];
      const data = { ...req, productType: ProductTypes.SNACK };
      const res = { ...data, ...req };
      const id = 'id';
      const referencedProduct = {
        title: 'beer',
        price: 11.11,
        productType: ProductTypes.BEER,
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      typesRepository.findById.mockResolvedValue(data as any);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      typesRepository.findByIdAndUpdate.mockResolvedValue(res as any);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      productsRepository.findOneByCategory.mockResolvedValue(referencedProduct as any);

      await expect(typesService.update(id, req)).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete one product type if no referenced products', async () => {
      const id = 'id';
      productsRepository.findOneByCategory.mockResolvedValue(null);
      typesRepository.deleteById.mockResolvedValue(1);

      expect(await typesService.delete(id)).toBeUndefined();
    });

    it('should throw Conflict error when deleting product type (with at least 1 referenced product)', async () => {
      const id = 'id';
      const referencedProduct = {
        title: 'beer',
        price: 11.11,
        productType: ProductTypes.BEER,
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      productsRepository.findOneByCategory.mockResolvedValue(referencedProduct as any);
      // typesRepository.deleteById.mockResolvedValue(1);

      await expect(typesService.delete(id)).rejects.toThrow(ConflictException);
    });

    it('should throw Not Found error if type not found while deleting', async () => {
      const id = 'id';

      productsRepository.findOneByCategory.mockResolvedValue(null);
      typesRepository.deleteById.mockResolvedValue(0);

      await expect(typesService.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
