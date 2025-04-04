import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async emitEvent(topic: string, key: string, value: any) {
    await this.kafkaClient.emit(topic, {
      key,
      value: JSON.stringify(value),
    });
  }

  subscribeToTopic(topic: string) {
    this.kafkaClient.subscribeToResponseOf(topic);
  }
}
