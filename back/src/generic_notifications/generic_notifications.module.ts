import { Module } from '@nestjs/common';
import { GenericNotificationsService } from './generic_notifications.service';
import { GenericNotificationsController } from './generic_notifications.controller';

@Module({
  controllers: [GenericNotificationsController],
  providers: [GenericNotificationsService],
})
export class GenericNotificationsModule {}
