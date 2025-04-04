import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from './ restaurant.entity';
import { MenuItem } from './restaurant-items.entity';

@Entity({ name: 'restaurant_menus' })
export class RestaurantMenu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToOne(() => Restaurant, { onDelete: 'CASCADE' })
  @JoinColumn()
  restaurant: Restaurant;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.menu, { cascade: true })
  items: MenuItem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
