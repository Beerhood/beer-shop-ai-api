import { Trim } from '@common/decorators/transform/trim';
import { IsDateString, IsEmail, Length } from 'class-validator';

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
  birthDate?: string;

  @Length(1, 1000)
  @Trim()
  address?: string;
}
