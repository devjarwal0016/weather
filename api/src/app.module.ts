import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { UsersModule } from './modules/users/users.module';
import { WeatherModule } from './modules/weather/weather.module';

const logger = new Logger('MongoDB');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionFactory: (connection) => {
        logger.log('Connected to MongoDB');
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
