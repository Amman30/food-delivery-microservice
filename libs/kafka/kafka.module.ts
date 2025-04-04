import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';

@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {
  static register(clientId: string, groupId: string): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.register([
          {
            name: 'KAFKA_SERVICE',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId,
                brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
              },
              consumer: {
                groupId,
              },
              run: {
                autoCommit: false,
              },
            },
          },
        ]),
      ],
    };
  }
}
