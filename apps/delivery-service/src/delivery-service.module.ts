import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeliveryServiceService } from './delivery-service.service';
import { DeliveryServiceController } from './delivery-service.controller';
import { Order, DeliveryAgent } from '@app/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from 'libs/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forFeature([Order, DeliveryAgent]),
    KafkaModule.register('delivery-service', 'delivery-consumer-group'),
  ],
  controllers: [DeliveryServiceController],
  providers: [DeliveryServiceService],
})
export class DeliveryServiceModule {}
