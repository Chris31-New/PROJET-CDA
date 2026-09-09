import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTaskDto';
import { RolesGuard } from 'src/auth/roles.guard';
import { RoleEnum } from 'prisma/generated/prisma/enums';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Project, Task } from 'prisma/generated/prisma/browser';
import { ProjectsService } from 'src/projects/projects.service';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly project: ProjectsService,
  ) {}

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Task | null> {
    return this.tasksService.getOne(id);
  }

  @Get()
  async getAll(): Promise<Task[]> {
    return this.tasksService.getAll();
  }

  @Get('project/:id')
  async getTasksByProjectId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task[]> {
    return this.tasksService.getTasksByProjectId(id);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SITE_MANAGER)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.delete(id);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SITE_MANAGER)
  @Post()
  async create(@Body() task: CreateTaskDto): Promise<Task> {
    const project = await this.project.findOne(task.project_id);
    if (!project) throw new NotFoundException('Project Not Found');

    return this.tasksService.create(task, project.id);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.SITE_MANAGER)
  @Post(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, task);
  }
}
