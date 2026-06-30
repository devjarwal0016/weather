import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weatherguard');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.log('❌ MongoDB connection error:', (error as any).message);
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(5000);
  console.log('🚀 Backend running on http://localhost:5000');
}
bootstrap();