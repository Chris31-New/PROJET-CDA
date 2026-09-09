import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  refreshToken?: string | null;

  @IsStrongPassword({ minLength: 8, minUppercase: 1, minSymbols: 1 })
  confirmPassword?: string;
}
