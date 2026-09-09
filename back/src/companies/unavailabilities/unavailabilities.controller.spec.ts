import { Test, TestingModule } from '@nestjs/testing';
import { UnavailabilitiesController } from './unavailabilities.controller';

describe('UnavailabilitiesController', () => {
  let controller: UnavailabilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnavailabilitiesController],
    }).compile();

    controller = module.get<UnavailabilitiesController>(
      UnavailabilitiesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
