import { SetMetadata } from '@nestjs/common';

export const KAFKA_TOPICS = 'KAFKA_TOPICS';

export const KafkaListener = (topic: string) =>
  SetMetadata(KAFKA_TOPICS, topic);
