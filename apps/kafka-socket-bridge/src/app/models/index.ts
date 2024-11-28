import {
  ConsumerConfig,
  ConsumerSubscribeTopics,
  KafkaMessage,
  Message,
} from 'kafkajs';

export interface KafkajsConsumerOptions {
  topics: ConsumerSubscribeTopics;
  config: ConsumerConfig;
  onMessage: (topic: string, message: KafkaMessage) => Promise<void>;
}

export interface ProduceMessage {
  topic: string;
  message: Message;
}
