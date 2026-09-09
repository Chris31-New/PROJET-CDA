import { Injectable } from '@nestjs/common';
import { Prisma, Task } from 'prisma/generated/prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDto } from './dto/createTaskDto';
import { UpdateTaskDto } from './dto/updateTaskDto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async buildTask(
    task: CreateTaskDto,
    projectId: number,
  ): Promise<Prisma.TaskCreateInput> {
    const { project_id, company_id, speciality_id, ...rest } = task;

    const data: Prisma.TaskCreateInput = {
      ...rest,
      start_date: new Date(task.start_date),
      end_date: new Date(task.end_date),
      project: { connect: { id: project_id } },
      speciality: { connect: { id: speciality_id } },
    };

    if (company_id) {
      data.company = { connect: { id: company_id } };
    }

    return data;
  }

  async getOne(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async getAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      include: { company: true, speciality: true },
    });
  }

  async getTasksByProjectId(projectId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { project_id: projectId },
      include: { company: true, speciality: true },
    });
  }

  async delete(id: number): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async create(task: CreateTaskDto, projectId: number): Promise<Task> {
    const data = await this.buildTask(task, projectId);

    return this.prisma.task.create({ data });
  }

  async update(id: number, task: UpdateTaskDto): Promise<Task> {
    const {
      depends_on,
      project_id,
      company_id,
      speciality_id,
      start_date,
      end_date,
      ...rest
    } = task;

    return this.prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        ...(start_date && { start_date: new Date(start_date) }),
        ...(end_date && { end_date: new Date(end_date) }),
        ...(project_id && { project: { connect: { id: project_id } } }),
        ...(company_id && { company: { connect: { id: Number(company_id) } } }),
        ...(speciality_id && {
          speciality: { connect: { id: speciality_id } },
        }),
      },
    });
  }
}
