import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { RestaurantMenu } from './restaurant-menu.entity';

@Entity({ name: 'menu_items' })
@Unique(['menu', 'name'])
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @ManyToOne(() => RestaurantMenu, (menu) => menu.items, {
    onDelete: 'CASCADE',
  })
  menu: RestaurantMenu;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
