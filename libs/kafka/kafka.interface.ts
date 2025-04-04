export interface KafkaMessage<T = any> {
  key: string;
  value: T;
  timestamp: string;
}
