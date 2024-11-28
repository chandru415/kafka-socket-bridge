import { Injectable } from '@nestjs/common';
import { KuProducerService } from './ku-producer.service';
import { ProduceMessage } from '../models';

@Injectable()
export class AppService {
  /**
   *
   */
  constructor(private readonly productionService: KuProducerService) {}

  getData(): { message: string } {
    return { message: 'Hello API chandu' };
  }

  async produceMessage(pm: ProduceMessage) {
    await this.productionService.produce(pm.topic, pm.message);
  }
}
