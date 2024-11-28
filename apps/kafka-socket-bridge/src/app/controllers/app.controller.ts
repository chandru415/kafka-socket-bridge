import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from '../services/app.service';
import { ProduceMessage } from '../models';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getData() {
    return this.appService.getData();
  }

  @Post('produce')
  produceAMessage(@Body() pm: ProduceMessage) {
    this.appService.produceMessage(pm);
  }
}
