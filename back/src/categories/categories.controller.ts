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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'prisma/generated/prisma/enums';
import { Category } from 'prisma/generated/prisma/client';
import { CategoriesService } from './categories.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(RoleEnum.SITE_MANAGER)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    const category = await this.categoriesService.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  @Roles(RoleEnum.SITE_MANAGER)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoriesService.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Roles(RoleEnum.SITE_MANAGER)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    const category = await this.categoriesService.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return this.categoriesService.remove(id);
  }
}
