import { Test, TestingModule } from '@nestjs/testing';
import { GenericNotificationsController } from './generic_notifications.controller';
import { GenericNotificationsService } from './generic_notifications.service';

describe('GenericNotificationsController', () => {
  let controller: GenericNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenericNotificationsController],
      providers: [GenericNotificationsService],
    }).compile();

    controller = module.get<GenericNotificationsController>(
      GenericNotificationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
