import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
  ParseEnumPipe,
  Query,
  ConflictException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import type { JwtPayload } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import {
  Project,
  RoleEnum,
  StatusProject,
  Project_Has_Company,
} from 'prisma/generated/prisma/client';
import { AddressesService } from 'src/addresses/addresses.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CompaniesService } from 'src/companies/companies.service';
import { imageUrlToBase64 } from 'src/utils/image.util';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly addressService: AddressesService,
    private readonly companiesService: CompaniesService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SITE_MANAGER)
  @Post()
  async create(
    @Body() body: CreateProjectDto,
    @GetUser() user: JwtPayload,
  ): Promise<Project> {
    const {
      address,
      city,
      postal_code,
      start_date,
      end_Date,
      budget,
      image: imageUrl,
      ...projectData
    } = body;
    const addressCreated = await this.addressService.findOneOrCreate({
      address,
      city,
      postal_code,
    });
    const imageBase64: string = imageUrl
      ? (await imageUrlToBase64(imageUrl)) || ''
      : '';

    const projectDatas = {
      ...projectData,
      start_date: new Date(start_date),
      end_Date: new Date(end_Date),
      budget: Number(budget),
      address_id: addressCreated.id,
      image: imageBase64,
      individual_id: Number(projectData.individual_id),
      site_manager_id: user.id,
    };
    // création projet en associant l'id de l'adresse créée
    return this.projectsService.create({
      ...projectDatas,
    });
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectsService.findAll();
  }

  //Get Own + By status;
  @Get('own')
  async findOwn(
    @GetUser() user: JwtPayload,
    @Query('status', new ParseEnumPipe(StatusProject, { optional: true }))
    status?: StatusProject,
  ): Promise<Project[]> {
    if (status) {
      //si reception d'un status en query
      return this.projectsService.findByStatus(user, status);
    }

    return this.projectsService.findOwn(user);
  }

  @Post(':id/companies')
  @Roles(RoleEnum.SITE_MANAGER)
  async addCompaniesToProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { company_ids: number[] },
  ) {
    return this.projectsService.addCompaniesToProject(id, body.company_ids);
  }

  @Delete(':id/companies/:companyId')
  @Roles(RoleEnum.SITE_MANAGER)
  removeCompany(
    @Param('id', ParseIntPipe) id: number,
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return this.projectsService.removeCompanyFromProject(id, companyId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const project = await this.projectsService.findOne(id);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SITE_MANAGER)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProjectDto,
  ): Promise<Project> {
    console.log('🚀 ~ ProjectsController ~ update ~ body:', body);
    //récupération de l'ancienne version du projet
    const oldProject = await this.projectsService.findOne(id);
    if (!oldProject) throw new NotFoundException('Project not found');

    const {
      address,
      city,
      postal_code,
      start_date,
      end_Date,
      budget,
      individual_id,
      image: imageUrl,
      ...projectData
    } = body;
    //update de l'adresse avec id récupérer sur ancien projet
    const addressUpdated = await this.addressService.update(
      oldProject.address_id,
      {
        address,
        city,
        postal_code,
      },
    );
    if (!addressUpdated)
      throw new Error('An error occurred while updating the address');

    const imageBase64: string = imageUrl
      ? (await imageUrlToBase64(imageUrl)) || ''
      : '';
    //update projet; address_id non modifiable
    return this.projectsService.update(id, {
      ...projectData,
      start_date: new Date(start_date!),
      end_Date: new Date(end_Date!),
      budget: Number(budget),
      image: imageBase64,
      individual: { connect: { id: Number(individual_id) } },
    });
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SITE_MANAGER)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    //regarder si le projet qu'on veut supprimer existe bien
    const projectExist = await this.projectsService.findIfExist(id);
    if (!projectExist) throw new NotFoundException();

    //suppression du projet
    const projectDeleted = await this.projectsService.remove(id);
    console.log(
      '🚀 ~ ProjectsController ~ remove ~ projectDeleted:',
      projectDeleted,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SITE_MANAGER)
  @Post(':id/companies/:companyId')
  async addCompany(
    @Param('id', ParseIntPipe) id: number,
    @Param('companyId', ParseIntPipe) companyId: number,
  ): Promise<Project_Has_Company> {
    const project = await this.projectsService.findOne(id);
    if (!project) throw new NotFoundException('Project not found');

    const company = await this.companiesService.findOne(companyId);
    if (!company) throw new NotFoundException('Company not found');

    const alreadyExists = await this.projectsService.findCompanyOnProject(
      id,
      companyId,
    );
    if (alreadyExists)
      throw new ConflictException(
        'Company already associated with this project',
      );

    return this.projectsService.addCompany(id, companyId);
  }
}
