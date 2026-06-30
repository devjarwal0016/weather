import { Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';

const cron = require('node-cron');

@Injectable()
export class WeatherService implements OnModuleInit {
  constructor(private telegramService: TelegramService) {}

  onModuleInit() {
    cron.schedule('*/5 * * * *', () => {
      this.checkWeather();
    });
  }

  async checkWeather() {
    try {
      const weather = await this.fetchWeather();
      const message = `Weather: ${weather.temp}°C, ${weather.description}`;
      await this.telegramService.sendMassAlert(message);
    } catch (err) {
      console.log('Weather check failed:', err);
    }
  }

  async fetchWeather() {
    const apiKey = process.env.WEATHER_API_KEY || 'dummy';
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}`
      );
      const data = await response.json();
      return {
        temp: Math.round(data.main.temp - 273.15),
        description: data.weather[0].description,
      };
    } catch {
      return { temp: 'N/A', description: 'Unknown' };
    }
  }
}