import { OrderStatus } from '@app/database';
import { IsEnum } from 'class-validator';

export class UpdateDeliveryStatusDto {
  @IsEnum([OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED])
  status: OrderStatus;
}
