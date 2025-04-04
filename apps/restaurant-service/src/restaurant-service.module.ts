import { Module } from '@nestjs/common';
import { RestaurantServiceController } from './restaurant-service.controller';
import { RestaurantServiceService } from './restaurant-service.service';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from 'libs/kafka/kafka.module';
import { DeliveryAgent, Order, Restaurant } from '@app/database';
import { MenuItem } from '@app/database/entities/restaurant/restaurant-items.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaService } from 'libs/kafka/kafka.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forFeature([Restaurant, MenuItem, Order, DeliveryAgent]),
    KafkaModule.register('restaurant-service', 'restaurant-service-group'),
  ],
  controllers: [RestaurantServiceController],
  providers: [RestaurantServiceService, KafkaService],
})
export class RestaurantServiceModule {}
