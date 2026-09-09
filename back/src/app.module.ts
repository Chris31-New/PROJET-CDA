import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CompaniesModule } from './companies/companies.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectsModule } from './projects/projects.module';
import { AddressesModule } from './addresses/addresses.module';
import { PlanningModule } from './planning/planning.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GenericNotificationsModule } from './generic_notifications/generic_notifications.module';
import { TasksModule } from './tasks/tasks.module';
import { ShoppingLinesModule } from './shopping_lines/shopping_lines.module';
import { SpecialitiesModule } from './specialities/specialities.module';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PrismaModule,
    CompaniesModule,
    ProfileModule,
    ProjectsModule,
    AddressesModule,
    PlanningModule,
    NotificationsModule,
    GenericNotificationsModule,
    TasksModule,
    ShoppingLinesModule,
    SpecialitiesModule,
    ArticlesModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
