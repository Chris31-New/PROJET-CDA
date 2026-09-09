import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Category } from 'prisma/generated/prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({ include: { articles: true } });
  }

  async findOne(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: { articles: true },
    });
  }

  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}
