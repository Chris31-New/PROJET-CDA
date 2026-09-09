import { forwardRef, Module } from '@nestjs/common';
import { UnavailabilitiesController } from './unavailabilities.controller';
import { UnavailabilitiesService } from './unavailabilities.service';
import { CompaniesModule } from '../companies.module';

@Module({
  imports: [forwardRef(() => CompaniesModule)],
  controllers: [UnavailabilitiesController],
  providers: [UnavailabilitiesService],
  exports: [UnavailabilitiesService],
})
export class UnavailabilitiesModule {}
