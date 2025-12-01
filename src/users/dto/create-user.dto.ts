import { Trim } from '@common/decorators/transform/trim';
import { IsDateNotInFuture } from '@common/decorators/validation/is-date-not-future';
import {
  DATE_INVALID_FORMAT_MESSAGE,
  DATE_MAX_CONSTRAINT_MESSAGE,
  DATE_MIN_CONSTRAINT_MESSAGE,
} from '@utils/constants/validation/validation-messages';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsOptional, Length, MinDate } from 'class-validator';

export class CreateUserDto {
  @Length(1, 250)
  @IsEmail()
  email!: string;

  @Length(1, 250)
  @Trim()
  firstName!: string;

  @Length(1, 250)
  @IsOptional()
  @Trim()
  lastName?: string | null;

  @IsDateNotInFuture({ message: DATE_MAX_CONSTRAINT_MESSAGE })
  @MinDate(new Date('1900-01-01'), { message: DATE_MIN_CONSTRAINT_MESSAGE })
  @IsDate({ message: DATE_INVALID_FORMAT_MESSAGE })
  @IsOptional()
  @Type(() => Date)
  birthDate?: Date | null;

  @Length(1, 1000)
  @IsOptional()
  @Trim()
  address?: string | null;
}
