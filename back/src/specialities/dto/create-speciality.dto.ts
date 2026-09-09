import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecialityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
