import { ProductTypes } from '@utils/enums';
import { validateDTO } from '@utils/validate';
import { UpdateTypeDto } from './update-type.dto';

describe('UpdateTypeDto', () => {
  it('should pass when all properties are defined', async () => {
    const data = {
      name: 'test',
      productType: ProductTypes.BEER,
    };

    const { errors } = await validateDTO(data, UpdateTypeDto);
    expect(errors.length).toBe(0);
  });

  it('should pass when all properties are undefined', async () => {
    const data = {};

    const { errors } = await validateDTO(data, UpdateTypeDto);
    expect(errors.length).toBe(0);
  });

  describe('name', () => {
    it('should pass when name is undefined', async () => {
      const data = { productType: ProductTypes.BEER };
      const { errors } = await validateDTO(data, UpdateTypeDto);
      expect(errors.length).toBe(0);
    });

    it.each([
      { val: null, desc: 'fail when name is null' },
      { val: '', desc: 'should still validate name rules if name is provided' },
    ])('should $desc', async ({ val }) => {
      const data = {
        name: val,
        productType: ProductTypes.BEER,
      };

      const { errors } = await validateDTO(data, UpdateTypeDto);
      expect(errors.length).not.toBe(0);
    });
  });

  describe('productType', () => {
    it('should pass when productType is undefined', async () => {
      const data = { name: 'test' };

      const { errors } = await validateDTO(data, UpdateTypeDto);
      expect(errors.length).toBe(0);
    });

    it.each([
      { val: null, desc: 'fail when productType is null' },
      { val: '', desc: 'should still validate productType rules if productType is provided' },
    ])('should $desc', async ({ val }) => {
      const data = {
        name: 'test',
        productType: val,
      };

      const { errors } = await validateDTO(data, UpdateTypeDto);
      expect(errors.length).not.toBe(0);
    });
  });
});
