import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'prisma/generated/prisma/enums';
import { Company } from 'prisma/generated/prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtPayload } from 'src/auth/roles.guard';
import { AddressesService } from 'src/addresses/addresses.service';

@UseGuards(AuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly addressService: AddressesService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SITE_MANAGER)
  @Post()
  async create(
    @Body() body: CreateCompanyDto,
    @GetUser() user: JwtPayload,
  ): Promise<Company> {
    const { address, city, postal_code, ...companyData } = body;
    const addressCreated = await this.addressService.create({
      address,
      city,
      postal_code,
    });
    if (!addressCreated) throw new Error('Fail to create address');
    const companyDatas = {
      ...companyData,
      city,
      address_id: addressCreated.id,
    };
    return this.companiesService.create({ ...companyDatas }, user.id);
  }

  @Get('types')
  getCompanyTypes(): string[] {
    return this.companiesService.getCompanyTypes();
  }

  @Get()
  async findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    const company = await this.companiesService.findOne(id);
    if (!company) throw new NotFoundException();
    return company;
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SITE_MANAGER, RoleEnum.COMPANY)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCompanyDto,
  ): Promise<Company> {
    const oldCompany = await this.companiesService.findOne(id);
    if (!oldCompany) throw new NotFoundException('Company not found');

    const { address, city, postal_code, ...projectData } = body;
    //update de l'adresse avec id récupérer sur ancien projet
    const addressUpdated = await this.addressService.update(
      oldCompany.address_id,
      {
        address,
        city,
        postal_code,
      },
    );
    if (!addressUpdated)
      throw new Error('An error occurred while updating the address');
    //update projet; address_id non modifiable
    return this.companiesService.update(id, {
      ...projectData,
    });
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SITE_MANAGER)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    return this.companiesService.remove(id);
  }
}
