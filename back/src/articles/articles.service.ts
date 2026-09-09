import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Article } from 'prisma/generated/prisma/client';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Article[]> {
    return this.prisma.article.findMany({ include: { category: true } });
  }

  async findOne(id: number): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async create(data: CreateArticleDto): Promise<Article> {
    return this.prisma.article.create({ data });
  }

  async update(id: number, data: UpdateArticleDto): Promise<Article> {
    return this.prisma.article.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Article> {
    return this.prisma.article.delete({ where: { id } });
  }
}
