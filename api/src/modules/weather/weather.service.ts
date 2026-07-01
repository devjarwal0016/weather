import { Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';

const cron = require('node-cron');

@Injectable()
export class WeatherService implements OnModuleInit {
  constructor(private telegramService: TelegramService) {}

  onModuleInit() {
    cron.schedule('0 */6 * * *', () => {
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
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    console.log('⚠️ No weather API key found');
    return { temp: 'N/A', description: 'No API key' };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    
    if (data.cod === 401) {
      console.log('❌ Invalid weather API key');
      return { temp: 'N/A', description: 'Invalid API key' };
    }
    
    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
    };
  } catch (error) {
    // console.log('Weather API error:', error.message);
    return { temp: 'N/A', description: 'API error' };
  }
}
}