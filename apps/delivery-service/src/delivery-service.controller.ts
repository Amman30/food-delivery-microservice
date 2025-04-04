import { Controller, Patch, Param, Body } from '@nestjs/common';
import { DeliveryServiceService } from './delivery-service.service';
import { UpdateDeliveryStatusDto } from './dtos/dto';

@Controller('delivery')
export class DeliveryServiceController {
  constructor(private readonly deliveryService: DeliveryServiceService) {}

  @Patch('orders/:id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateDeliveryStatusDto,
  ) {
    return await this.deliveryService.updateDeliveryStatus(orderId, dto.status);
  }
}
