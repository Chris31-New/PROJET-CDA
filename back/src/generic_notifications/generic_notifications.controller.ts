import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { GenericNotificationsService } from './generic_notifications.service';
import { CreateGenericNotificationDto } from './dto/create-generic_notification.dto';
import { UpdateGenericNotificationDto } from './dto/update-generic_notification.dto';
import { GenericNotification } from './entities/generic_notification.entity';

@Controller('generic-notifications')
export class GenericNotificationsController {
  constructor(
    private readonly genericNotificationsService: GenericNotificationsService,
  ) {}

  @Post()
  async create(
    @Body() createGenericNotificationDto: CreateGenericNotificationDto,
  ): Promise<GenericNotification> {
    return this.genericNotificationsService.create(
      createGenericNotificationDto,
    );
  }

  @Get()
  async findAll(): Promise<GenericNotification[]> {
    return this.genericNotificationsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GenericNotification> {
    const genericNotif = await this.genericNotificationsService.findOne(id);
    if (!genericNotif) throw new NotFoundException();
    return genericNotif;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenericNotificationDto: UpdateGenericNotificationDto,
  ): Promise<GenericNotification> {
    return this.genericNotificationsService.update(
      id,
      updateGenericNotificationDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const genericNotifDeleted =
      await this.genericNotificationsService.remove(id);
    console.log(
      '🚀 ~ GenericNotificationsController ~ remove ~ genericNotifDeleted:',
      genericNotifDeleted,
    );
  }
}
