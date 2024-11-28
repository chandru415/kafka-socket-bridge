import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { KafkaBridgeService } from './services/kafka-bridge.service';
import { KuProducerService } from './services/ku-producer.service';
import { KuConsumerService } from './services/ku-consumer.service';
import { ConfigModule } from '@nestjs/config';
import { SocketGatewayService } from './services/socket-gateway.service';
import { KuAdminService } from './services/ku-admin.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    KafkaBridgeService,
    KuProducerService,
    KuAdminService,
    KuConsumerService,
    SocketGatewayService,
  ],
})
export class AppModule {}
