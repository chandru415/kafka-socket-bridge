import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { KsbKafkaService } from './services/ksb-kafka.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, KsbKafkaService],
})
export class AppModule {}
