import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Restaurant } from './ restaurant.entity';

@Entity({ name: 'restaurant_operating_hours' })
export class RestaurantOperatingHour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'day_of_week', type: 'smallint' })
  dayOfWeek: number;

  @Column({ name: 'open_time', type: 'time' })
  openTime: string;

  @Column({ name: 'close_time', type: 'time' })
  closeTime: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.operatingHours, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
