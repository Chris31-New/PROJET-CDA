import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RoleEnum } from 'prisma/generated/prisma/enums';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { type JwtPayload, RolesGuard } from 'src/auth/roles.guard';
import { CreateCompanyUnavailabilitiesDto } from './dto/createCompanyUnavailabilitiesDTO';
import { UnavailabilitiesService } from './unavailabilities.service';
import { CompaniesService } from '../companies.service';
import { UpdateCompanyUnavailabilitiesDto } from './dto/updateCompanyUnavailabilitiesDTO';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Company_Unavailability } from 'prisma/generated/prisma/client';

@UseGuards(AuthGuard)
@Controller('unavailabilities')
export class UnavailabilitiesController {
  constructor(
    private readonly unavailabilitiesService: UnavailabilitiesService,
    private readonly companyService: CompaniesService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.COMPANY)
  @Post('company/:companyId')
  async createCompanyUnavailability(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() body: CreateCompanyUnavailabilitiesDto,
    @GetUser() user: JwtPayload,
  ): Promise<Company_Unavailability> {
    const company = await this.companyService.findOne(companyId);
    if (!company) throw new NotFoundException('Company Not Found');
    if (company.userId !== user.id)
      throw new UnauthorizedException(
        'Unauthorized : You are not the owner of this company.',
      );

    return this.unavailabilitiesService.create(companyId, body);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.COMPANY)
  @Put('company/:companyId/unavailabilities/:unavailabilityId')
  async updateCompanyUnavailability(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('unavailabilityId', ParseIntPipe) unavailabilityId: number,
    @Body() body: UpdateCompanyUnavailabilitiesDto,
    @GetUser() user: JwtPayload,
  ): Promise<Company_Unavailability> {
    // Vérifier que la company existe
    const company = await this.companyService.findOne(companyId);
    if (!company) throw new NotFoundException('Company Not Found');

    // Vérifier que l'utilisateur est bien le propriétaire
    if (company.userId !== user.id) {
      throw new UnauthorizedException(
        'Unauthorized: You are not the owner of this company.',
      );
    }

    // Vérifier que l'utilisateur est bien le propriétaire
    if (company.userId !== user.id) {
      throw new UnauthorizedException(
        'Unauthorized: You are not the owner of this company.',
      );
    }

    // Vérifier que l'indisponibilité existe
    const unavailability =
      await this.unavailabilitiesService.getOne(unavailabilityId);
    if (!unavailability || unavailability.company_id !== companyId) {
      throw new NotFoundException(
        'Company Unavailability Not Found Or does not belong to this company',
      );
    }

    const start_date = body.start_date
      ? new Date(body.start_date)
      : new Date(unavailability.start_date);
    const end_date = body.end_date
      ? new Date(body.end_date)
      : new Date(unavailability.end_date);

    return this.unavailabilitiesService.update(
      companyId,
      unavailabilityId,
      body,
      start_date,
      end_date,
    );
  }
}
