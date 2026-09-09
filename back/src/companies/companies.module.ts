import { forwardRef, Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { UnavailabilitiesModule } from './unavailabilities/unavailabilities.module';
import { AddressesModule } from 'src/addresses/addresses.module';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [forwardRef(() => UnavailabilitiesModule), AddressesModule],
  exports: [CompaniesService],
})
export class CompaniesModule {}
