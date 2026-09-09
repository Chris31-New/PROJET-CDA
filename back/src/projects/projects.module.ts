import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { AddressesModule } from 'src/addresses/addresses.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [AddressesModule, NotificationsModule, CompaniesModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
