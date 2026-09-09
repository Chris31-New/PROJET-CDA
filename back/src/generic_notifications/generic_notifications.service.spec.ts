import { Test, TestingModule } from '@nestjs/testing';
import { GenericNotificationsService } from './generic_notifications.service';

describe('GenericNotificationsService', () => {
  let service: GenericNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenericNotificationsService],
    }).compile();

    service = module.get<GenericNotificationsService>(
      GenericNotificationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
