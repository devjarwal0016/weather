import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const port = Number(process.env.PORT) || 5000;

  app.enableCors();
  await app.listen(port);
  logger.log(`Backend running on http://localhost:${port}`);
}

bootstrap();
