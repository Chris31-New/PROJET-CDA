import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Company, CompanyType, Prisma } from 'prisma/generated/prisma/client';
import { CompanyData } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dataCo: CompanyData, userId: number): Promise<Company> {
    const { specialitiesId, address_id, ...rest } = dataCo;

    return this.prisma.company.create({
      data: {
        ...rest,
        refUser: { connect: { id: userId } },
        address: { connect: { id: address_id } },
        specialities: {
          create: specialitiesId.map((id) => ({
            company_id: undefined, // parfois nécessaire pour Prisma
            speciality: { connect: { id } },
          })),
        },
      },
      include: {
        specialities: { include: { speciality: true } },
      },
    });
  }

  getCompanyTypes(): string[] {
    return Object.values(CompanyType);
  }

  async findAll(): Promise<Company[]> {
    return this.prisma.company.findMany({
      include: {
        specialities: {
          include: {
            speciality: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.CompanyUpdateInput): Promise<Company> {
    const companyUpdated = await this.prisma.company.update({
      where: { id },
      data,
    });
    return companyUpdated;
  }

  async remove(id: number): Promise<Company> {
    return this.prisma.company.delete({
      where: { id },
    });
  }
}
