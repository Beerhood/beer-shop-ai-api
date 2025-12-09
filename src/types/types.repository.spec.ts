import { TypesRepository } from './types.repository';
import { Type } from '@common/models/type.model';
import { ProductTypes } from '@utils/enums';
import { Test } from '@nestjs/testing';

describe('TypesRepository', () => {
  let typesRepository: TypesRepository;

  const _data: Type[] = [
    {
      name: 'beer',
      productType: ProductTypes.BEER,
    },
    {
      name: 'snack',
      productType: ProductTypes.SNACK,
    },
  ];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TypesRepository],
    }).compile();

    typesRepository = moduleRef.get(TypesRepository);
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('deleteById', () => {
    it('deleteById should return number of deleted items', async () => {
      const _id = 'id';

      const deleteSpy = jest
        .spyOn(typesRepository, 'deleteOne')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .mockResolvedValue({ deletedCount: 1, acknowledged: true } as any);

      const result = await typesRepository.deleteById(_id);

      expect(deleteSpy).toHaveBeenCalledWith({ _id });
      expect(result).toBe(1);
    });
  });
});
