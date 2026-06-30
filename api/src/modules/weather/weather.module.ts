import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [TelegramModule],
  providers: [WeatherService],
})
export class WeatherModule {}