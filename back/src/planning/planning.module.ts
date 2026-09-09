import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { UnavailabilitiesModule } from 'src/companies/unavailabilities/unavailabilities.module';

@Module({
  imports: [ProjectsModule, CompaniesModule, UnavailabilitiesModule],
  providers: [PlanningService],
  controllers: [PlanningController],
})
export class PlanningModule {}
