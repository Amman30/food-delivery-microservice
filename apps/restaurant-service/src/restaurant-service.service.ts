import { Restaurant, DeliveryAgent } from '@app/database';
import { Order, OrderStatus } from '@app/database/entities/order/order.entity';
import { MenuItem } from '@app/database/entities/restaurant/restaurant-items.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaService } from '../.././../libs/kafka/kafka.service';

@Injectable()
export class RestaurantServiceService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(DeliveryAgent)
    private agentRepo: Repository<DeliveryAgent>,
    private kafkaService: KafkaService,
  ) {}

  async setRestaurantStatus(
    id: string,
    isOnline: boolean,
  ): Promise<Restaurant> {
    await this.restaurantRepo.update(id, { isOnline });
    return this.restaurantRepo.findOneBy({ id });
  }

  async updateMenuItem(
    id: number,
    update: Partial<MenuItem>,
  ): Promise<MenuItem> {
    await this.menuItemRepo.update(id, update);
    return await this.menuItemRepo.findOneBy({ id });
  }

  async processOrder(orderId: string, accept: boolean): Promise<Order> {
    const status = accept ? OrderStatus.ACCEPTED : OrderStatus.REJECTED;
    await this.orderRepo.update(orderId, { orderStatus: status });

    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['restaurant'],
    });

    if (accept) {
      await this.autoAssignDeliveryAgent(order);
      await this.kafkaService.emitEvent('orders.accepted', orderId, {
        eventType: 'ORDER_ACCEPTED',
        orderId,
        restaurantId: order.restaurant.id,
        timestamp: new Date().toISOString(),
      });
    }

    return order;
  }

  private async autoAssignDeliveryAgent(order: Order): Promise<void> {
    const availableAgent = await this.agentRepo.findOne({
      where: {
        isAvailable: true,
      },
    });

    if (availableAgent) {
      await this.agentRepo.update(availableAgent.id, {
        isAvailable: false,
        currentOrderId: order.id,
      });

      await this.orderRepo.update(order.id, {
        orderStatus: OrderStatus.OUT_FOR_DELIVERY,
        deliveryAgent: availableAgent,
      });
    }
  }
}
