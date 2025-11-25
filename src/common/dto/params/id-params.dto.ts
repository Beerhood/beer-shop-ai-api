import { Trim } from '@common/decorators/transform/trim';
import { IsHexadecimal, Length } from 'class-validator';

export class IdMongoParamsDto {
  @IsHexadecimal()
  @Length(24, 24)
  @Trim()
  id!: string;
}
