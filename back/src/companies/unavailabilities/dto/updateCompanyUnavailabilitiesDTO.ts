import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyUnavailabilitiesDto } from './createCompanyUnavailabilitiesDTO';

export class UpdateCompanyUnavailabilitiesDto extends PartialType(
  CreateCompanyUnavailabilitiesDto,
) {}
