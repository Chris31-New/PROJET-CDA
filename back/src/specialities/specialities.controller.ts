import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { Speciality } from 'prisma/generated/prisma/client';

@Controller('specialities')
export class SpecialitiesController {
  constructor(private readonly specialitiesService: SpecialitiesService) {}

  @Post()
  async create(
    @Body() createSpecialityDto: CreateSpecialityDto,
  ): Promise<Speciality> {
    return this.specialitiesService.create(createSpecialityDto);
  }

  @Get()
  async findAll(): Promise<Speciality[]> {
    return this.specialitiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Speciality> {
    const speciality = await this.specialitiesService.findOne(id);
    if (!speciality) {
      throw new NotFoundException(`Speciality with ID ${id} not found`);
    }
    return speciality;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSpecialityDto: UpdateSpecialityDto,
  ): Promise<Speciality> {
    const speciality = await this.specialitiesService.findOne(id);
    if (!speciality) {
      throw new NotFoundException(`Speciality with ID ${id} not found`);
    }
    return this.specialitiesService.update(id, updateSpecialityDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Speciality> {
    const speciality = await this.specialitiesService.findOne(id);
    if (!speciality) {
      throw new NotFoundException(`Speciality with ID ${id} not found`);
    }
    return this.specialitiesService.remove(id);
  }
}
