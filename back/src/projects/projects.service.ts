import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  Prisma,
  Project,
  Project_Has_Company,
  StatusProject,
} from 'prisma/generated/prisma/client';
import { JwtPayload } from 'src/auth/roles.guard';
import { ProjectData } from './entities/project.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(data: ProjectData): Promise<Project> {
    const newProject = await this.prisma.project.create({
      data,
    });
    await this.notificationService.createProjectNotification(newProject);
    return newProject;
  }

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({
      include: { tasks: true, companies: true, addressRef: true },
    });
  }

  async addCompaniesToProject(
    projectId: number,
    companyIds: number[],
  ): Promise<void> {
    // Vérifie que le projet existe
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);

    // Crée les liaisons en évitant les doublons
    await this.prisma.project_Has_Company.createMany({
      data: companyIds.map((company_id) => ({
        project_id: projectId,
        company_id,
      })),
      skipDuplicates: true,
    });
  }

  async removeCompanyFromProject(
    projectId: number,
    companyId: number,
  ): Promise<void> {
    await this.prisma.project_Has_Company.delete({
      where: {
        company_id_project_id: {
          company_id: companyId,
          project_id: projectId,
        },
      },
    });
  }

  async findOwn(user: JwtPayload): Promise<Project[]> {
    //récupération des projets en fonction de l'id de l'user connecté et de son rôle
    const where = this.buildRoleWhere(user);
    return this.prisma.project.findMany({
      where,
      include: { tasks: true, companies: true, addressRef: true },
    });
  }

  private buildRoleWhere(user: JwtPayload) {
    switch (user.role) {
      case 'SITE_MANAGER':
        return { site_manager_id: user.id };

      case 'INDIVIDUAL':
        return { individual_id: user.id };

      case 'COMPANY':
        return {
          companies: {
            some: {
              company: {
                userId: user.id,
              },
            },
          },
        };

      default:
        throw new ForbiddenException('Invalid role');
    }
  }

  async findByStatus(
    user: JwtPayload,
    status: StatusProject,
  ): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        ...this.buildRoleWhere(user),
        status,
      },
    });
  }

  async findOne(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        companies: {
          include: {
            company: {
              include: { specialities: { include: { speciality: true } } },
            },
          },
        },
        tasks: true,
        addressRef: true,
      },
    });
  }

  async findIfExist(id: number): Promise<number> {
    return this.prisma.project.count({ where: { id } });
  }

  async addCompany(
    projectId: number,
    companyId: number,
  ): Promise<Project_Has_Company> {
    return this.prisma.project_Has_Company.create({
      data: {
        company_id: companyId,
        project_id: projectId,
      },
    });
  }

  async findCompanyOnProject(
    projectId: number,
    companyId: number,
  ): Promise<Project_Has_Company | null> {
    return this.prisma.project_Has_Company.findUnique({
      where: {
        company_id_project_id: {
          company_id: companyId,
          project_id: projectId,
        },
      },
    });
  }

  async findAllCompaniesOnProject(
    projectId: number,
  ): Promise<Project_Has_Company[]> {
    return this.prisma.project_Has_Company.findMany({
      where: { project_id: projectId },
      include: { company: true },
    });
  }

  async update(id: number, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data,
      include: { addressRef: true },
    });
  }

  async remove(id: number): Promise<Project> {
    return this.prisma.project.delete({ where: { id } });
  }
}
