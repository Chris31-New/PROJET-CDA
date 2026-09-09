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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'prisma/generated/prisma/enums';
import { Article } from 'prisma/generated/prisma/client';
import { CategoriesService } from 'src/categories/categories.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Roles(RoleEnum.SITE_MANAGER)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    const category = await this.categoriesService.findOne(
      createArticleDto.category_id,
    );
    if (!category) throw new NotFoundException('Category not found');
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Article> {
    const article = await this.articlesService.findOne(id);
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  @Roles(RoleEnum.SITE_MANAGER)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.articlesService.findOne(id);
    if (!article) throw new NotFoundException('Article not found');

    if (updateArticleDto.category_id) {
      const category = await this.categoriesService.findOne(
        updateArticleDto.category_id,
      );
      if (!category) throw new NotFoundException('Category not found');
    }

    return this.articlesService.update(id, updateArticleDto);
  }

  @Roles(RoleEnum.SITE_MANAGER)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Article> {
    const article = await this.articlesService.findOne(id);
    if (!article) throw new NotFoundException('Article not found');
    return this.articlesService.remove(id);
  }
}
