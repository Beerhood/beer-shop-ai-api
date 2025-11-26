import { Trim } from '@common/decorators/transform/trim';
import { IsDateString, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @Length(1, 250)
  @IsEmail()
  email!: string;

  @Length(1, 250)
  @Trim()
  firstName!: string;

  @Length(1, 250)
  @Trim()
  lastName!: string;

  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @Length(1, 1000)
  @IsOptional()
  @Trim()
  address?: string;
}
