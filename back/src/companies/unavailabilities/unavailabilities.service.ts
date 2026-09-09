import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCompanyUnavailabilitiesDto } from './dto/createCompanyUnavailabilitiesDTO';
import { UpdateCompanyUnavailabilitiesDto } from './dto/updateCompanyUnavailabilitiesDTO';
import { Company_Unavailability } from 'prisma/generated/prisma/client';

@Injectable()
export class UnavailabilitiesService {
  constructor(private readonly prisma: PrismaService) {}

  private async noOverlapsUnavailabilities(
    companyId: number,
    start_date: Date,
    end_date: Date,
    excludeId?: number,
  ): Promise<boolean> {
    const companyUnavailabilities =
      await this.prisma.company_Unavailability.findMany({
        where: {
          company_id: companyId,
          NOT: excludeId ? { id: excludeId } : undefined,
        },
      });
    for (const unavailability of companyUnavailabilities) {
      const existStart = new Date(unavailability.start_date);
      const existEnd = new Date(unavailability.end_date);
      if (
        (start_date >= existStart && start_date <= existEnd) ||
        (end_date >= existStart && end_date <= existEnd) ||
        (start_date <= existStart && end_date >= existEnd)
      ) {
        return false;
      }
    }
    return true;
  }

  async getAll(
    companyId: number[],
  ): Promise<Omit<Company_Unavailability, 'createdAt' | 'updatedAt'>[]> {
    return this.prisma.company_Unavailability.findMany({
      where: { company_id: { in: companyId } },
    });
  }

  async getOne(
    unavailabilityId: number,
  ): Promise<Company_Unavailability | null> {
    return this.prisma.company_Unavailability.findUnique({
      where: { id: unavailabilityId },
    });
  }

  async create(
    companyId: number,
    companyUnavailability: CreateCompanyUnavailabilitiesDto,
  ): Promise<Company_Unavailability> {
    const isOverlapping = await this.noOverlapsUnavailabilities(
      companyId,
      new Date(companyUnavailability.start_date),
      new Date(companyUnavailability.end_date),
    );

    if (isOverlapping === false) {
      throw new Error('Company Unavailability Overlaps with an existing one');
    }

    return this.prisma.company_Unavailability.create({
      data: {
        start_date: companyUnavailability.start_date,
        end_date: companyUnavailability.end_date,
        company: { connect: { id: companyId } },
      },
    });
  }

  async update(
    companyId: number,
    unavailabilityId: number,
    body: UpdateCompanyUnavailabilitiesDto,
    currentStart: Date,
    currentEnd: Date,
  ): Promise<Company_Unavailability> {
    // construire les nouvelles dates finales pour le PATCH
    const newStart = body.start_date ? new Date(body.start_date) : currentStart;
    const newEnd = body.end_date ? new Date(body.end_date) : currentEnd;

    // vérifier les overlaps avec les autres indisponibilités
    const isOverlapping = await this.noOverlapsUnavailabilities(
      companyId,
      newStart,
      newEnd,
      unavailabilityId,
    );

    if (!isOverlapping) {
      throw new Error('Company Unavailability Overlaps with an existing one');
    }

    // update seulement les champs fournis
    return this.prisma.company_Unavailability.update({
      where: { id: unavailabilityId },
      data: {
        ...(body.start_date && { start_date: newStart }),
        ...(body.end_date && { end_date: newEnd }),
      },
    });
  }
}
