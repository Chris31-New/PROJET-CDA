import { PartialType } from '@nestjs/mapped-types';
import { CreateGenericNotificationDto } from './create-generic_notification.dto';

export class UpdateGenericNotificationDto extends PartialType(
  CreateGenericNotificationDto,
) {}
