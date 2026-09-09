import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { CompanyType } from 'prisma/generated/prisma/enums';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsEnum(CompanyType)
  type: CompanyType;

  @IsString()
  description: string;

  @Length(9, 9)
  @IsString()
  siren: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  address: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 5)
  postal_code: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  logo: string;

  @IsString()
  image: string;

  @IsString()
  employeeCount: string;

  @IsArray()
  @IsInt({ each: true })
  specialitiesId: number[];
}
