import { TransformOptionalToNumber } from '@common/decorators/transform/transform-optional-number';
import { TransformObjectValuesToNumber } from '@common/decorators/transform/transform-values-number';
import { IsObjectValuesIn } from '@common/decorators/validation/is-object-values-in';
import { IsInt, IsObject, IsOptional, IsPositive } from 'class-validator';

export class FindQueryDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  @TransformOptionalToNumber()
  limit?: number;

  @IsPositive()
  @IsInt()
  @IsOptional()
  @TransformOptionalToNumber()
  skip?: number;

  @IsObject()
  @IsOptional()
  filter?: Record<string, unknown>;

  @IsObjectValuesIn([1, -1])
  @IsObject()
  @IsOptional()
  @TransformObjectValuesToNumber()
  sort?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  search?: Record<string, unknown>;
}
