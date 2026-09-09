import { Injectable } from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { Speciality } from 'prisma/generated/prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SpecialitiesService {
  constructor(private prisma: PrismaService) {}
  async create(createSpecialityDto: CreateSpecialityDto): Promise<Speciality> {
    return this.prisma.speciality.create({ data: createSpecialityDto });
  }

  async findAll(): Promise<Speciality[]> {
    return this.prisma.speciality.findMany();
  }

  async findOne(id: number): Promise<Speciality | null> {
    return this.prisma.speciality.findUnique({ where: { id } });
  }

  async update(
    id: number,
    updateSpecialityDto: UpdateSpecialityDto,
  ): Promise<Speciality> {
    return this.prisma.speciality.update({
      where: { id },
      data: updateSpecialityDto,
    });
  }

  async remove(id: number): Promise<Speciality> {
    return this.prisma.speciality.delete({ where: { id } });
  }
}
