import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryServiceController } from './delivery-service.controller';
import { DeliveryServiceService } from './delivery-service.service';

describe('DeliveryServiceController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let deliveryServiceController: DeliveryServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryServiceController],
      providers: [DeliveryServiceService],
    }).compile();

    deliveryServiceController = app.get<DeliveryServiceController>(
      DeliveryServiceController,
    );
  });
});
