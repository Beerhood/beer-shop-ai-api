import { Trim, TrimArrayElements } from '@common/decorators/transform/trim';
import {
  ArrayMinSize,
  IsArray,
  IsHexadecimal,
  IsNumber,
  IsOptional,
  IsPositive,
  Length,
  Max,
} from 'class-validator';

export class CreateOrderDto {
  @IsHexadecimal({ each: true })
  @Length(24, 24, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  @TrimArrayElements()
  products!: string[];

  @Length(1, 1000)
  @Trim()
  address!: string;

  @Max(999999)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  expectedTotal?: number | null;
}
