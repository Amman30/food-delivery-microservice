import { Order, DeliveryAgent, OrderStatus } from '@app/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KafkaListener } from 'libs/kafka/kafka.decorator';
import { Repository } from 'typeorm';

@Injectable()
export class DeliveryServiceService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(DeliveryAgent)
    private agentRepository: Repository<DeliveryAgent>,
  ) {}

  async updateDeliveryStatus(
    orderId: string,
    newStatus: OrderStatus,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['deliveryAgent'],
    });

    if (!order) {
      throw new Error('Order not found');
    }
    const allowedTransitions = {
      [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
    };

    if (!allowedTransitions[order.orderStatus].includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${order.orderStatus} to ${newStatus}`,
      );
    }

    order.orderStatus = newStatus;
    await this.orderRepository.save(order);

    if (newStatus === OrderStatus.DELIVERED && order.deliveryAgent) {
      await this.agentRepository.update(order.deliveryAgent.id, {
        isAvailable: true,
        currentOrderId: null,
      });
    }

    return order;
  }

  @KafkaListener('orders.accepted')
  async handleOrderAccepted(payload: any) {
    const { orderId } = payload;
    await this.initializeDelivery(orderId);
  }

  async initializeDelivery(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    return order;
  }
}
