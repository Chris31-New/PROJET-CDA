import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Company_Unavailability, Task } from 'prisma/generated/prisma/browser';
import { RoleEnum } from 'prisma/generated/prisma/enums';
import { RolesGuard, type JwtPayload } from 'src/auth/roles.guard';
import { PlanningService } from './planning.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ProjectsService } from 'src/projects/projects.service';
import { Project } from 'prisma/generated/prisma/client';

@UseGuards(AuthGuard)
@Controller('planning')
export class PlanningController {
  constructor(
    private readonly planningService: PlanningService,
    private readonly projects: ProjectsService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.INDIVIDUAL)
  @Get(':projectId/company-unavailabilities')
  async getProjectCompanyUnavailabilities(
    @Param('projectId', ParseIntPipe) projectId: number,
    @GetUser() user: JwtPayload,
  ): Promise<Omit<Company_Unavailability, 'id' | 'createdAt' | 'updatedAt'>[]> {
    return this.planningService.getProjectCompanyUnavailabilities(
      projectId,
      user,
    );
  }

  @Get('projects/:projectId')
  async getProjects(
    @Param('projectId', ParseIntPipe) projectId: number,
    @GetUser() userInfo: JwtPayload,
  ): Promise<
    Pick<Project, 'id' | 'name' | 'status' | 'start_date' | 'end_Date'>[]
  > {
    const project = await this.projects.findOne(projectId);
    if (!project) throw new Error('Project Not Found');
    return this.planningService.getProjectDates(projectId, userInfo, project);
  }

  @Get('projects/:projectId/tasks')
  async getProjectTasks(
    @Param('projectId', ParseIntPipe) projectId: number,
    @GetUser() user: JwtPayload,
  ): Promise<
    Pick<Task, 'id' | 'start_date' | 'end_date' | 'name' | 'status'>[]
  > {
    const project = await this.projects.findOne(projectId);
    if (!project) throw new Error('Project Not Found');
    return this.planningService.getProjectTasksDates(projectId, user);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.COMPANY)
  @Get('companies/:companyId/unavailabilities')
  async getCompanyUnavailabilities(
    @Param('companyId', ParseIntPipe) companyId: number,
  ): Promise<Omit<Company_Unavailability, 'id' | 'createdAt' | 'updatedAt'>[]> {
    return this.planningService.getCompanyUnavailabilities(companyId);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SITE_MANAGER)
  @Get('companies/unavailabilities')
  async getAllCompaniesUnavailabilities(): Promise<
    Omit<Company_Unavailability, 'createdAt' | 'updatedAt'>[]
  > {
    return this.planningService.getAllCompaniesUnavailabilities();
  }
}
