import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ProjectType, StatusProject } from 'prisma/generated/prisma/enums';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  number_Project: string;

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
  end_Date: string;

  @IsEnum(StatusProject)
  @IsNotEmpty()
  status: StatusProject;

  @IsNumber()
  @IsNotEmpty()
  budget: string;

  @IsInt()
  @IsNotEmpty()
  individual_id: string;

  @IsEnum(ProjectType)
  @IsNotEmpty()
  project_type: ProjectType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  address: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 5)
  postal_code: string;
}
