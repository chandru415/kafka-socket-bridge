import { Admin, Kafka } from 'kafkajs';
import { IAdmin } from '../contracts/IAdmin';
import { sleep } from '../utils/sleep';
import { Logger } from '@nestjs/common';

export class AdminRepository implements IAdmin {
  kafka: Kafka;
  admin: Admin;
  logger: Logger;

  constructor(brokers: string[]) {
    this.kafka = new Kafka({
      clientId: 'KAFKA_PRODUCER_SERVICE',
      brokers: brokers,
      retry: {
        retries: 5, // Retry in case of failure
        initialRetryTime: 300, // Initial retry time in milliseconds
        maxRetryTime: 10000, // Maximum retry time
      },
    });
    this.admin = this.kafka.admin();
  }

  async connectAdmin() {
    try {
      await this.admin.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connectAdmin();
    }
  }
  async disconnectAdmin() {
    await this.admin.disconnect();
  }
  async listofAllAvailableTopics() {
    return await this.admin.listTopics();
  }
}
