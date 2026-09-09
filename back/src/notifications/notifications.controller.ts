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
  UseGuards,
  ParseEnumPipe,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  GenericNotification,
  Notification,
  User_Has_Notification,
} from 'prisma/generated/prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtPayload } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get('own')
  async findOwn(
    @GetUser() user: JwtPayload,
    @Query('type', new ParseEnumPipe(GenericNotification, { optional: true }))
    type?: GenericNotification,
  ): Promise<User_Has_Notification[]> {
    if (type) {
      //si reception d'un type en query
      return this.notificationsService.findOwnByType(user.id, type);
    }
    return this.notificationsService.findOwn(user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    const notif = await this.notificationsService.findOne(id);
    if (!notif) throw new NotFoundException();
    return notif;
  }

  @Patch(':notifId')
  async update(
    @GetUser() user: JwtPayload,
    @Param('notifId', ParseIntPipe) notifId: number,
  ): Promise<User_Has_Notification> {
    return this.notificationsService.update(notifId, user.id, {
      reading_date: new Date(),
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const notifDeleted = await this.notificationsService.remove(id);
    console.log(
      '🚀 ~ NotificationsController ~ remove ~ notifDeleted:',
      notifDeleted,
    );
  }
}
