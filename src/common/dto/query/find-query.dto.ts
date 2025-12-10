import { TransformOptionalToNumber } from '@common/decorators/transform/transform-optional-number';
import { TransformObjectValuesToNumber } from '@common/decorators/transform/transform-values-number';
import { IsObjectValuesIn } from '@common/decorators/validation/is-object-values-in';
import { IsInt, IsObject, IsOptional, Min } from 'class-validator';

export class FindQueryDto {
  @Min(0)
  @IsInt()
  @IsOptional()
  @TransformOptionalToNumber()
  limit?: number;

  @Min(0)
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
