import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { RoleEnum } from 'prisma/generated/prisma/enums';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 8, minUppercase: 1, minSymbols: 1 })
  password: string;

  @IsString()
  confirmPassword: string;

  @IsEnum(RoleEnum)
  role: RoleEnum;
}
