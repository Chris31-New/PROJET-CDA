import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { StatusTask } from 'prisma/generated/prisma/enums';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @IsEnum(StatusTask)
  @IsNotEmpty()
  status: StatusTask;

  @IsString()
  @IsNotEmpty()
  status_note: string;

  @IsNumber()
  @IsNotEmpty()
  project_id: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  company_id: number;

  @IsNumber()
  @IsNotEmpty()
  speciality_id: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  depends_on?: number;
}
