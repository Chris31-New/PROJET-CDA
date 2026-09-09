import { Injectable } from '@nestjs/common';
import { CreateShoppingLineDto } from './dto/create-shopping_line.dto';
import { UpdateShoppingLineDto } from './dto/update-shopping_line.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Shopping_Line } from 'prisma/generated/prisma/client';

@Injectable()
export class ShoppingLinesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Shopping_Line[]> {
    return this.prisma.shopping_Line.findMany({
      include: { article: true, task: true },
    });
  }

  async findOne(id: number): Promise<Shopping_Line | null> {
    return this.prisma.shopping_Line.findUnique({
      where: { id },
      include: { article: true, task: true },
    });
  }

  async findByTask(taskId: number): Promise<Shopping_Line[]> {
    return this.prisma.shopping_Line.findMany({
      where: { task_id: taskId },
      include: { article: true },
    });
  }

  async create(data: CreateShoppingLineDto): Promise<Shopping_Line> {
    return this.prisma.shopping_Line.create({ data });
  }

  async update(
    id: number,
    data: UpdateShoppingLineDto,
  ): Promise<Shopping_Line> {
    return this.prisma.shopping_Line.update({
      where: { id },
      data,
      include: { article: true },
    });
  }

  async remove(id: number): Promise<Shopping_Line> {
    return this.prisma.shopping_Line.delete({ where: { id } });
  }
}
