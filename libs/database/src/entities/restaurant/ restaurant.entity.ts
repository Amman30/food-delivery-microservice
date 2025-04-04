import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RestaurantOperatingHour } from './restaurant-operating-hour.entity';

@Entity({ name: 'restaurants' })
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ name: 'phone_number', length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  averageRating?: number;

  @Column({ name: 'is_online', default: false })
  isOnline: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(
    () => RestaurantOperatingHour,
    (operatingHour) => operatingHour.restaurant,
  )
  operatingHours: RestaurantOperatingHour[];
}
