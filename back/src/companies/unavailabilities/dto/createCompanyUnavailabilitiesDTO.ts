import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCompanyUnavailabilitiesDto {
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @IsNumber()
  @IsNotEmpty()
  company_id: number;
}
