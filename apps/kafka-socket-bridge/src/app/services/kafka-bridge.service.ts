import { Injectable, OnModuleInit } from '@nestjs/common';
import { KuConsumerService } from './ku-consumer.service';
import { SocketGatewayService } from './socket-gateway.service';
import { environment } from '../environments/environment';

@Injectable()
export class KafkaBridgeService implements OnModuleInit {
  /**
   *
   */
  constructor(
    private readonly _consumerService: KuConsumerService,
    private readonly _sg: SocketGatewayService
  ) {}

  async onModuleInit() {
    await this._consumerService.consume({
      topics: { topics: environment.kafkaTopics, fromBeginning: true },
      config: { groupId: 'unifact-consumer1' },
      onMessage: async (topic, message) => {
        this._sg.sendMessageToClients({
          topic,
          message: message?.value ? message?.value?.toString() : '',
        });
      },
    });
  }
}
