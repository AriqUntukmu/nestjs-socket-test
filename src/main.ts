import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as serverless from 'serverless-http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // await app.listen(3000);
  app.enableCors();
  await app.init();
}
bootstrap();

module.exports.handler = serverless(server);
