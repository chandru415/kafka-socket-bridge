import { DocumentBuilder } from '@nestjs/swagger';

export const unifactSwaggerConfig = new DocumentBuilder()
  .setTitle('NestJS API')
  .setDescription('API documentation for NestJS application')
  .setVersion('1.0')
  .build();
