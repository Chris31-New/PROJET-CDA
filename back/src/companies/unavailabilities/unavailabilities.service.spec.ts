import { Test, TestingModule } from '@nestjs/testing';
import { UnavailabilitiesService } from './unavailabilities.service';

describe('UnavailabilitiesService', () => {
  let service: UnavailabilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnavailabilitiesService],
    }).compile();

    service = module.get<UnavailabilitiesService>(UnavailabilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
