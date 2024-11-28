import { Message, Producer } from 'kafkajs';
import { IProducer } from '../contracts/IProducer';
import { Logger } from '@nestjs/common';
import { sleep } from '../utils/sleep';
import { AdminRepository } from './admin-repository';

export class ProducerRepository extends AdminRepository implements IProducer {
  private readonly producer: Producer;

  constructor(private readonly topic: string, brokers: string[]) {
    super(brokers);
    this.producer = this.kafka.producer();
    this.logger = new Logger(topic);
  }

  async produce(message: Message) {
    await this.producer.send({
      topic: this.topic,
      messages: [message],
      acks: 1,
    });
  }

  async connect() {
    try {
      await this.producer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
