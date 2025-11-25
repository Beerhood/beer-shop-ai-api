import { Trim } from '@common/decorators/transform/trim';
import { UserRoles } from '@utils/enums';
import { IsDateString, IsEmail, IsEnum, Length } from 'class-validator';

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

  @IsEnum(UserRoles)
  @Trim()
  role!: UserRoles;

  @IsDateString()
  birthDate?: string;

  @Length(1, 1000)
  @Trim()
  address?: string;
}
