import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'prisma/prisma.service';
import {
  GenericNotification,
  Notification,
  Project,
  User_Has_Notification,
} from 'prisma/generated/prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNotificationDto): Promise<Notification> {
    return this.prisma.notification.create({ data });
  }

  async createProjectNotification(project: Project) {
    return this.prisma.$transaction(async (tx) => {
      // récupérer le generic template
      const generic = await tx.generic_Notification.findFirst({
        where: { title: 'Project Created' },
      });

      if (!generic) throw new Error('Generic notification not found');

      // créer la notification
      const notification = await tx.notification.create({
        data: {
          generic_notification_id: generic.id,
          project_id: project.id,
          is_archived: false,
        },
      });

      // lier aux users concernés
      await tx.user_Has_Notification.createMany({
        data: [
          {
            user_id: project.individual_id,
            notification_id: notification.id,
          },
          {
            user_id: project.site_manager_id,
            notification_id: notification.id,
          },
        ],
      });

      return notification;
    });
  }

  async findAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany();
  }

  async findOwn(id: number): Promise<User_Has_Notification[]> {
    const usersNotif = await this.prisma.user_Has_Notification.findMany({
      where: { user_id: id },
      include: {
        notification: {
          include: {
            genericNotification: true,
          },
        },
      },
    });
    return usersNotif;
  }

  async findOwnByType(
    id: number,
    type: GenericNotification,
  ): Promise<User_Has_Notification[]> {
    const usersNotif = await this.prisma.user_Has_Notification.findMany({
      where: {
        user_id: id,
        notification: {
          genericNotification: {
            type,
          },
        },
      },
      include: {
        notification: {
          include: {
            genericNotification: true,
          },
        },
      },
    });
    return usersNotif;
  }

  async findOne(id: number): Promise<Notification | null> {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  async update(
    notifId: number,
    userId: number,
    data: UpdateNotificationDto,
  ): Promise<User_Has_Notification> {
    return this.prisma.user_Has_Notification.update({
      where: {
        user_id_notification_id: {
          user_id: userId,
          notification_id: notifId,
        },
      },
      include: {
        notification: {
          include: {
            genericNotification: true,
          },
        },
      },
      data,
    });
  }

  async remove(id: number): Promise<Notification> {
    return this.prisma.notification.delete({ where: { id } });
  }
}
