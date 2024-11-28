import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { IConsumer } from '../contracts/IConsumer';
import { ConfigService } from '@nestjs/config';
import { CusomerRepository } from '../repository/cusomer-repository';
import { KafkajsConsumerOptions } from '../models';
import { environment } from '../environments/environment';

@Injectable()
export class KuConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async consume({ topics, config, onMessage }: KafkajsConsumerOptions) {
    const consumer = new CusomerRepository(
      topics,
      config,
      environment.kafkaBrokers
    );
    await consumer.connect();
    await consumer.consume(onMessage);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

}
