import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { GenericNotification } from 'prisma/generated/prisma/enums';

export class CreateGenericNotificationDto {
  @IsEnum(GenericNotification)
  @IsNotEmpty()
  type: GenericNotification;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
