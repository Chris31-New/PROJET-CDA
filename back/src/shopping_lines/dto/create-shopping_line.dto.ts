import { IsInt, IsPositive } from 'class-validator';

export class CreateShoppingLineDto {
  @IsInt()
  task_id: number;

  @IsInt()
  article_id: number;

  @IsInt()
  @IsPositive()
  unit_price: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
