import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { DeliveryAgent } from './ delivery.entity';

@Entity('delivery_agent_ratings')
export class DeliveryAgentRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => DeliveryAgent, { onDelete: 'CASCADE' })
  deliveryAgent: DeliveryAgent;

  @Column({ type: 'smallint' })
  ratingValue: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
