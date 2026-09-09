import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 5)
  postal_code: string;
}
