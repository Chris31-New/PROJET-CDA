import { Injectable } from '@nestjs/common';
import {
  Company_Unavailability,
  Project,
  Task,
} from 'prisma/generated/prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import type { JwtPayload } from 'src/auth/roles.guard';
import { UnavailabilitiesService } from 'src/companies/unavailabilities/unavailabilities.service';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class PlanningService {
  constructor(
    private readonly projects: ProjectsService,
    private readonly unavailabilities: UnavailabilitiesService,
    private readonly prisma: PrismaService,
  ) {}

  private async isUserProject(
    projectId: number,
    user: JwtPayload,
  ): Promise<boolean> {
    const projects = await this.projects.findOwn(user);
    if (!projects.some((p) => p.id === projectId))
      throw new Error('Unauthorized');
    return projects.some((p) => p.id === projectId);
  }

  async getProjectCompanyUnavailabilities(
    projectId: number,
    user: JwtPayload,
  ): Promise<Omit<Company_Unavailability, 'id' | 'createdAt' | 'updatedAt'>[]> {
    const projects = await this.projects.findOwn(user);
    if (!projects.some((p) => p.id === projectId))
      throw new Error('Unauthorized');

    const companiesOnProject =
      await this.projects.findAllCompaniesOnProject(projectId);
    const companyIds = companiesOnProject.map((c) => c.company_id);

    return this.unavailabilities.getAll(companyIds);
  }

  async getCompanyUnavailabilities(
    companyId: number,
  ): Promise<Omit<Company_Unavailability, 'id' | 'createdAt' | 'updatedAt'>[]> {
    return this.unavailabilities.getAll([companyId]);
  }

  async getAllCompaniesUnavailabilities(): Promise<
    Omit<Company_Unavailability, 'createdAt' | 'updatedAt'>[]
  > {
    const companies = await this.prisma.company.findMany({
      select: { id: true },
    });
    const companyIds = companies.map((c) => c.id);
    return this.unavailabilities.getAll(companyIds);
  }

  async getProjectDates(
    projectId: number,
    user: JwtPayload,
    project: Project,
  ): Promise<
    Pick<Project, 'id' | 'name' | 'status' | 'start_date' | 'end_Date'>[]
  > {
    if (user.role === 'COMPANY') {
      const userFromDb = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { companies: true },
      });
      const userCompanyIds = userFromDb?.companies.map((c) => c.id) || [];

      const tasks = await this.prisma.task.findMany({
        where: {
          project_id: projectId,
          company_id: { in: userCompanyIds },
        },
        select: { start_date: true, end_date: true },
      });

      if (tasks.length > 0) {
        const newStart_date = tasks.reduce(
          (min, task) => (task.start_date < min ? task.start_date : min),
          tasks[0].start_date,
        );
        const newEnd_date = tasks.reduce(
          (max, task) => (task.end_date > max ? task.end_date : max),
          tasks[0].end_date,
        );
        return [
          {
            id: projectId,
            name: project.name,
            status: project.status,
            start_date: newStart_date,
            end_Date: newEnd_date,
          },
        ];
      }
    }
    if (user.role === 'INDIVIDUAL') await this.isUserProject(projectId, user);
    return this.prisma.project.findMany({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        status: true,
        start_date: true,
        end_Date: true,
      },
    });
  }

  async getProjectTasksDates(
    projectId: number,
    user: JwtPayload,
  ): Promise<
    Pick<Task, 'id' | 'start_date' | 'end_date' | 'name' | 'status'>[]
  > {
    if (user.role === 'INDIVIDUAL') {
      await this.isUserProject(projectId, user);
    }

    if (user.role === 'COMPANY') {
      const userFromDb = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { companies: true },
      });

      if (!userFromDb || !userFromDb.companies.length)
        throw new Error('Unauthorized');

      const userCompanyIds = userFromDb.companies.map((c) => c.id);

      const companiesOnProject =
        await this.projects.findAllCompaniesOnProject(projectId);

      const isOnProject = companiesOnProject.some((c) =>
        userCompanyIds.includes(c.company_id),
      );

      if (!isOnProject) throw new Error('Unauthorized');

      return this.prisma.task.findMany({
        where: {
          project_id: projectId,
          company_id: { in: userCompanyIds },
        },
        select: {
          id: true,
          start_date: true,
          end_date: true,
          name: true,
          status: true,
        },
      });
    }

    return this.prisma.task.findMany({
      where: { project_id: projectId },
      select: {
        id: true,
        start_date: true,
        end_date: true,
        name: true,
        status: true,
      },
    });
  }
}
