// companies.service.spec.ts

import { beforeEach, describe } from 'node:test';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { Company } from '@prisma/client';
import { jest } from '@jest/globals';

describe('CompaniesService', () => {
  let service: CompaniesService;

  const mockPrisma = {
    company: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CompaniesService(mockPrisma as any);
  });

  describe('findOne', () => {
    it('should return a company when it exists', async () => {
      const company = {
        id: 1,
        name: 'Ma Société',
        description: 'Description de test',
      };

      mockPrisma.company.findUnique.mockResolvedValue(company);

      const result = await service.findOne(1);

      expect(result).toEqual(company);

      expect(mockPrisma.company.findUnique).toHaveBeenCalledTimes(1);

      expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });

    it('should return null when company does not exist', async () => {
      mockPrisma.company.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();

      expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
      });
    });

    it('should throw if prisma throws an error', async () => {
      mockPrisma.company.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findOne(1)).rejects.toThrow('Database error');

      expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });
  });
});