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
} from '@nestjs/common';
import { ShoppingLinesService } from './shopping_lines.service';
import { CreateShoppingLineDto } from './dto/create-shopping_line.dto';
import { UpdateShoppingLineDto } from './dto/update-shopping_line.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { TasksService } from 'src/tasks/tasks.service';
import { RoleEnum, Shopping_Line } from 'prisma/generated/prisma/client';
import { Roles } from 'src/auth/roles.decorator';

// Je decommenterais quand j'aurais fini articles

@UseGuards(AuthGuard, RolesGuard)
@Controller('shopping-lines')
export class ShoppingLinesController {
  constructor(
    private readonly shoppingLinesService: ShoppingLinesService,
    //private readonly articlesService: ArticlesService,
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  findAll(): Promise<Shopping_Line[]> {
    return this.shoppingLinesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Shopping_Line> {
    const line = await this.shoppingLinesService.findOne(id);
    if (!line) throw new NotFoundException('Shopping line not found');
    return line;
  }

  @Get('task/:taskId')
  findByTask(
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<Shopping_Line[]> {
    return this.shoppingLinesService.findByTask(taskId);
  }

  @Roles(RoleEnum.SITE_MANAGER)
  @Post()
  async create(
    @Body() createShoppingLineDto: CreateShoppingLineDto,
  ): Promise<Shopping_Line> {
    const task = await this.tasksService.getOne(createShoppingLineDto.task_id);
    if (!task) throw new NotFoundException('Task not found');

    return this.shoppingLinesService.create(createShoppingLineDto);
  }

  @Roles(RoleEnum.SITE_MANAGER)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShoppingLineDto: UpdateShoppingLineDto,
  ): Promise<Shopping_Line> {
    const line = await this.shoppingLinesService.findOne(id);
    if (!line) throw new NotFoundException('Shopping line not found');
    return this.shoppingLinesService.update(id, updateShoppingLineDto);
  }

  @Roles(RoleEnum.SITE_MANAGER)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Shopping_Line> {
    const line = await this.shoppingLinesService.findOne(id);
    if (!line) throw new NotFoundException('Shopping line not found');
    return this.shoppingLinesService.remove(id);
  }
}
