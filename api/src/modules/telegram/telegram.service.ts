import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

const { TelegramBot } = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private bot: any;

  constructor(private usersService: UsersService) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      this.bot = new TelegramBot(token, { polling: true });
      this.setupBotHandlers();
    }
  }

  private setupBotHandlers() {
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, 'Welcome! Please login to the web app to link your account.');
    });
  }

  async sendAlertToUser(userId: string, message: string) {
    const user = await this.usersService.findById(userId);
    if (user && user.telegramChatId) {
      await this.bot.sendMessage(user.telegramChatId, message);
      return true;
    }
    return false;
  }

  async sendMassAlert(message: string) {
    const users = await this.usersService.getApprovedUsers();
    let count = 0;
    for (const user of users) {
      if (user.telegramChatId) {
        await this.bot.sendMessage(user.telegramChatId, message);
        count++;
      }
    }
    return count;
  }
}
