import { ProductTypes } from '@utils/enums';
import { CreateTypeDto } from './create-type.dto';
import { validateDTO } from '@utils/validate';

describe('CreateTypeDto', () => {
  it('should pass the validation', async () => {
    const dto = {
      name: 'test',
      productType: ProductTypes.BEER,
    };

    const { errors } = await validateDTO(dto, CreateTypeDto);
    expect(errors.length).toBe(0);
  });

  describe('name', () => {
    it('should pass if trim works on name', async () => {
      const data = {
        name: ' test ',
        productType: ProductTypes.BEER,
      };

      const { errors, dto } = await validateDTO(data, CreateTypeDto);
      expect(errors.length).toBe(0);
      expect(dto.name).toBe(data.name.trim());
    });

    it.each([
      { val: undefined, desc: 'is undefined' },
      { val: 1, desc: 'is not a string' },
      { val: '', desc: 'is too short' },
      { val: ''.padStart(251, 'a'), desc: 'is too long' },
    ])('should fail when name $desc', async ({ val }) => {
      const dto = {
        name: val,
        productType: ProductTypes.BEER,
      };
      const { errors } = await validateDTO(dto, CreateTypeDto);

      expect(errors.length).not.toBe(0);
    });
  });

  describe('productType', () => {
    it('should pass if trim works on productType', async () => {
      const dto = {
        name: 'test',
        productType: `${ProductTypes.BEER} `,
      };

      const { errors } = await validateDTO(dto, CreateTypeDto);
      expect(errors.length).toBe(0);
    });

    it.each([
      { val: undefined, desc: 'is undefined' },
      { val: 'test', desc: 'is not in ProductTypes' },
    ])('should fail when productType $desc', async ({ val }) => {
      const dto = {
        name: 'test',
        productType: val,
      };
      const { errors } = await validateDTO(dto, CreateTypeDto);
      expect(errors.length).not.toBe(0);
    });
  });
});
