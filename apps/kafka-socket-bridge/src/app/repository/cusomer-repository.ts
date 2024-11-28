import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  KafkaMessage,
} from 'kafkajs';
import { IConsumer } from '../contracts/IConsumer';
import { sleep } from '../utils/sleep';
import { Logger } from '@nestjs/common';
import retry from 'async-retry';
import { AdminRepository } from './admin-repository';

export class CusomerRepository extends AdminRepository implements IConsumer {
  private readonly consumer: Consumer;

  constructor(
    private readonly topics: ConsumerSubscribeTopics,
    config: ConsumerConfig,
    brokers: string[]
  ) {
    super(brokers);

    this.consumer = this.kafka.consumer({
      ...config,
      allowAutoTopicCreation: true,
    });
    this.logger = new Logger(`${topics.topics}-${config.groupId}`);
  }

  async consume(
    onMessage: (topic: string, message: KafkaMessage) => Promise<void>
  ) {
    await this.consumer.subscribe(this.topics);
    await this.consumer.run({
      eachMessage: async ({ topic, message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await retry(async () => onMessage(topic, message), {
            retries: 3,
            onRetry: (error, attempt) =>
              this.logger.error(
                `Error consuming message, executing retry ${attempt}/3...`,
                error
              ),
          });
        } catch (err) {
          this.logger.error(
            'Error consuming message. Adding to dead letter queue...',
            err
          );
        }
      },
    });
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
