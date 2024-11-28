import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { IProducer } from '../contracts/IProducer';
import { ConfigService } from '@nestjs/config';
import { Message } from 'kafkajs';
import { ProducerRepository } from '../repository/producer-repository';
import { environment } from '../environments/environment';

@Injectable()
export class KuProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, IProducer>();

  constructor(private readonly configService: ConfigService) {}

  async produce(topic: string, message: Message) {
    const producer = await this.getProducer(topic);
    await producer.produce(message);
  }

  private async getProducer(topic: string) {
    let producer = this.producers.get(topic);

    if (!producer) {
      producer = new ProducerRepository(topic, environment.kafkaBrokers);
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }

  async onApplicationShutdown(signal?: string) {
    for (const producer of this.producers.values()) {
      await producer.disconnect();
    }
  }
}
