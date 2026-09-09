import { IsString, IsNotEmpty, IsInt, MaxLength } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsInt()
  category_id: number;
}
