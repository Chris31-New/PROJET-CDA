import { Injectable } from '@nestjs/common';
import { CreateGenericNotificationDto } from './dto/create-generic_notification.dto';
import { UpdateGenericNotificationDto } from './dto/update-generic_notification.dto';
import { Generic_Notification } from 'prisma/generated/prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GenericNotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateGenericNotificationDto,
  ): Promise<Generic_Notification> {
    return this.prisma.generic_Notification.create({ data });
  }

  async findAll(): Promise<Generic_Notification[]> {
    return this.prisma.generic_Notification.findMany();
  }

  async findOne(id: number): Promise<Generic_Notification | null> {
    return this.prisma.generic_Notification.findUnique({ where: { id } });
  }

  async update(
    id: number,
    data: UpdateGenericNotificationDto,
  ): Promise<Generic_Notification> {
    return this.prisma.generic_Notification.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Generic_Notification> {
    return this.prisma.generic_Notification.delete({ where: { id } });
  }
}
