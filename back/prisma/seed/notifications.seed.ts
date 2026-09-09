import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {
  Generic_Notification,
  Notification,
  PrismaClient,
} from '../generated/prisma/client';
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

export async function seedNotifications() {
  ///////////////////
  // GENERIC NOTIFICATIONS
  ///////////////////
  console.log('Seeding Generic Notifications...');

  const genericNotifications: Omit<
    Generic_Notification,
    'id' | 'createdAt' | 'updatedAt'
  >[] = [
    // INFO
    {
      type: 'INFO',
      title: 'Project Created',
      message: 'A new project has been successfully created.',
    },
    {
      type: 'INFO',
      title: 'Task Assigned',
      message: 'A new task has been assigned to your company.',
    },
    {
      type: 'INFO',
      title: 'Company Added to Project',
      message: 'A company has been successfully added to the project.',
    },
    {
      type: 'INFO',
      title: 'Task Dependency Created',
      message: 'A dependency between two tasks has been created.',
    },

    // WARNING
    {
      type: 'WARNING',
      title: 'Project Near Deadline',
      message: 'The project is approaching its planned end date.',
    },
    {
      type: 'WARNING',
      title: 'Company Unavailable',
      message:
        'The assigned company is unavailable during the scheduled task period.',
    },
    {
      type: 'WARNING',
      title: 'Task Blocked',
      message: 'A task has been marked as blocked and requires attention.',
    },

    // ALERT
    {
      type: 'ALERT',
      title: 'Project Delayed',
      message: 'The project has exceeded its scheduled end date.',
    },
    {
      type: 'ALERT',
      title: 'Critical Task Blocked',
      message:
        'A critical task is blocked and may impact the overall project timeline.',
    },
    {
      type: 'ALERT',
      title: 'Task Dependency Conflict',
      message: 'A task has started before its dependency was completed.',
    },
  ];

  await prisma.generic_Notification.createMany({
    data: genericNotifications,
    skipDuplicates: true,
  });

  ///////////////////
  // REAL NOTIFICATIONS
  ///////////////////

  console.log('Seeding Notifications...');

  const generic = await prisma.generic_Notification.findMany();
  const projects = await prisma.project.findMany();
  const tasks = await prisma.task.findMany();
  const users = await prisma.user.findMany();

  const notificationsData: Notification[] = [];

  // helper pour récupérer un template
  function getGeneric(title: string) {
    return generic.find((g) => g.title === title);
  }

  // -------------------
  // PROJECT CREATION
  // -------------------
  for (const project of projects) {
    const template = getGeneric('Project Created');
    if (!template) continue;

    const notif = await prisma.notification.create({
      data: {
        generic_notification_id: template.id,
        project_id: project.id,
        is_archived: false,
      },
    });

    notificationsData.push(notif);
  }
  // -------------------
  // TASK ASSIGNMENT
  // -------------------
  for (const task of tasks.slice(0, 10)) {
    const template = getGeneric('Task Assigned');
    if (!template) continue;

    const notif = await prisma.notification.create({
      data: {
        generic_notification_id: template.id,
        task_id: task.id,
        project_id: task.project_id,
        is_archived: false,
      },
    });

    notificationsData.push(notif);
  }
  // -------------------
  // ALERT : TASK BLOCKED
  // -------------------
  const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED');

  for (const task of blockedTasks) {
    const template = getGeneric('Critical Task Blocked');
    if (!template) continue;

    const notif = await prisma.notification.create({
      data: {
        generic_notification_id: template.id,
        task_id: task.id,
        project_id: task.project_id,
        is_archived: false,
      },
    });

    notificationsData.push(notif);
  }

  // -------------------
  // USER_HAS_NOTIFICATION
  // -------------------
  console.log('Linking Notifications to Users...');

  for (const notification of notificationsData) {
    // choisir 2 à 4 utilisateurs aléatoires
    const shuffledUsers = users.sort(() => 0.5 - Math.random());
    const selectedUsers = shuffledUsers.slice(
      0,
      Math.floor(Math.random() * 3) + 2,
    );

    for (const user of selectedUsers) {
      await prisma.user_Has_Notification.upsert({
        where: {
          user_id_notification_id: {
            user_id: user.id,
            notification_id: notification.id,
          },
        },
        update: {},
        create: {
          user_id: user.id,
          notification_id: notification.id,
          reading_date: Math.random() > 0.5 ? new Date() : null,
        },
      });
    }
  }

  console.log('Notifications seeded successfully!');
}
