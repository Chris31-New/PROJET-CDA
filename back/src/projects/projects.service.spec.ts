import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { AddressesService } from 'src/addresses/addresses.service';
import { PrismaService } from 'prisma/prisma.service';

const prismaMock = {
  project: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        AddressesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });
  describe('getOneProjects', () => {
    it('should return an array of projects', async () => {
      const mockProjects = [
        {
          id: 1,
          name: 'Project 1',
          companies: [],
          tasks: [],
          addressRef: null,
        },
        {
          id: 2,
          name: 'Project 2',
          companies: [],
          tasks: [],
          addressRef: null,
        },
      ];
      prismaMock.project.findUnique.mockResolvedValue(mockProjects);
      const result = await service.findOne(1);
      expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { companies: true, tasks: true, addressRef: true },
      });
      expect(result).toEqual(mockProjects);
    });
  });
  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });
});
