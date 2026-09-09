import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 8, minUppercase: 1, minSymbols: 1 })
  password: string;
}
