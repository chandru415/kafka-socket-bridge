import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { Consumer, Kafka, Message, Producer } from 'kafkajs';
import { configurationItem } from '../configs';
import { sleep } from '../utils';

@Injectable()
export class KsbKafkaService implements OnApplicationShutdown {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();
  private readonly logger: Logger;

  /**
   *
   */
  constructor() {
    this.kafka = new Kafka({
      clientId: 'nestjs-kafka',
      brokers: configurationItem.kafkaBrokers,
    });
    this.producer = this.kafka.producer();

    this.logger = new Logger('nestjs-kafka');
  }

  async connectProducer() {
    try {
      await this.producer.connect();
    } catch (error) {
      this.logger.error('Failed to connect to Kafka.', error);
      await sleep(5000);
      await this.connectProducer();
    }
  }

  async sendMessage(topic: string, message: Message) {
    await this.producer.send({
      topic,
      messages: [message],
    });
  }

  async disconnectProducer() {
    await this.producer.disconnect();
  }

  onApplicationShutdown() {
    this.disconnectProducer();
  }
}
