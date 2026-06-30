import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionFactory: (connection) => {
        console.log('✅ Connected to MongoDB');
        return connection;
      },
    }),
    AuthModule,
    UsersModule,
    TelegramModule,
    WeatherModule,
  ],
})
export class AppModule {}