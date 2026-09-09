import { PartialType } from '@nestjs/mapped-types';
import { CreateShoppingLineDto } from './create-shopping_line.dto';

export class UpdateShoppingLineDto extends PartialType(CreateShoppingLineDto) {}
