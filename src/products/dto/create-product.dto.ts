import { Trim } from '@common/decorators/transform/trim';
import { ProductTypes } from '@utils/enums';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsHexadecimal,
  IsNumber,
  IsObject,
  IsPositive,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class BeerDetailsDto {
  @Max(100)
  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 })
  ABV!: number;

  @Max(100)
  @Min(3)
  @IsNumber({ maxDecimalPlaces: 2 })
  IBU!: number;

  @Max(1.1)
  @Min(1.0)
  @IsNumber({ maxDecimalPlaces: 4 })
  OG!: number;

  @Length(1, 100)
  @Trim()
  style!: string;
}

export class SnackDetailsDto {
  @Length(1, 100)
  @Trim()
  flavor!: string;
}

export class CreateProductDto {
  @Length(1, 250)
  @Trim()
  title!: string;

  @IsUrl()
  @Length(1, 1000)
  @Trim()
  image!: string;

  @Length(1, 3000)
  @Trim()
  description!: string;

  @Length(1, 250)
  @Trim()
  brand!: string;

  @Length(1, 250)
  @Trim()
  country!: string;

  @IsHexadecimal()
  @Length(24, 24)
  @Trim()
  type!: string; // ObjectId

  @Max(999999)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  price!: number;

  @IsEnum(ProductTypes)
  @Trim()
  productType!: ProductTypes;

  @IsObject()
  @ValidateNested()
  @Type((type) => {
    const obj = type?.object;
    if (!obj) return Object;
    if (obj.productType === ProductTypes.BEER) return BeerDetailsDto;
    if (obj.productType === ProductTypes.SNACK) return SnackDetailsDto;
    return Object;
  })
  details!: BeerDetailsDto | SnackDetailsDto;
}
