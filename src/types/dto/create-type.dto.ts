import { Trim } from '@common/decorators/transform/trim';
import { ProductTypes } from '@utils/enums';
import { IsEnum, Length } from 'class-validator';

export class CreateTypeDto {
  @Length(1, 250)
  @Trim()
  name!: string;

  @IsEnum(ProductTypes)
  @Trim()
  productType!: ProductTypes;
}
