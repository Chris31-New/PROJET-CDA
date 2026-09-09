import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  @IsNotEmpty()
  generic_notification_id: number;

  @IsDateString()
  send_date: Date;

  @IsNumber()
  @IsOptional()
  task_id: number;

  @IsNumber()
  @IsOptional()
  project_id: number;

  @IsBoolean()
  is_archived: boolean;
}
