import { Trim } from '@common/decorators/transform/trim';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsHexadecimal,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProductInOrderDto {
  @IsHexadecimal()
  @Length(24, 24)
  @Trim()
  item!: string;

  @Max(1000)
  @Min(1)
  @IsPositive()
  @IsInt()
  count!: number;
}

export class CreateOrderDto {
  @IsObject({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested()
  @Type(() => ProductInOrderDto)
  products!: ProductInOrderDto[];

  @Length(1, 1000)
  @Trim()
  address!: string;

  @Max(999999)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  expectedTotal?: number;
}
