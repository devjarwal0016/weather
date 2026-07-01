import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private bot: any;

  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    await this.initializeBot();
  }

  async onModuleDestroy() {
    if (this.bot?.isPolling?.()) {
      await this.bot.stopPolling();
    }
  }

  async initializeBot() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token || token === 'your-telegram-bot-token') {
      this.logger.warn('Telegram bot disabled - no valid TELEGRAM_BOT_TOKEN');
      return;
    }

    try {
      const { TelegramBot } = require('node-telegram-bot-api');
      this.bot = new TelegramBot(token, { polling: true });
      this.setupBotHandlers();

      const me = await this.bot.getMe();
      this.logger.log(`Telegram bot initialized as @${me.username ?? me.first_name}`);
    } catch (error: any) {
      this.bot = undefined;
      this.logger.error(
        `Failed to initialize Telegram bot: ${error?.message ?? error}`,
        error?.stack,
      );
    }
  }

  private setupBotHandlers() {
    if (!this.bot) return;

    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      await this.bot.sendMessage(chatId, 'Welcome! Please send your email to link your account.');
    });

    this.bot.onText(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, async (msg) => {
      const chatId = msg.chat.id;
      const email = msg.text;

      try {
        this.logger.log(`Linking email: ${email} for chat: ${chatId}`);

        const user = await this.usersService.findByEmail(email);
        if (user) {
          await this.usersService.saveTelegramId(user._id.toString(), chatId.toString());
          await this.bot.sendMessage(
            chatId,
            'Your account is linked! You will receive weather alerts.',
          );
          this.logger.log(`User ${email} linked successfully`);
        } else {
          await this.bot.sendMessage(chatId, 'User not found. Please login to the web app first.');
          this.logger.warn(`User not found: ${email}`);
        }
      } catch (error: any) {
        this.logger.error(`Error linking account: ${error?.message ?? error}`, error?.stack);
        await this.bot.sendMessage(chatId, 'Error linking account. Please try again.');
      }
    });

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (text && text.startsWith('/')) return;
      if (text && text.includes('@')) return;

      await this.bot.sendMessage(
        chatId,
        'Send /start to begin or send your email to link your account.',
      );
    });

    this.bot.on('polling_error', (err) => {
      this.logger.error(`Telegram polling error: ${err?.message ?? err}`, err?.stack);
    });

    this.bot.on('error', (err) => {
      this.logger.error(`Telegram bot error: ${err?.message ?? err}`, err?.stack);
    });
  }

  async sendAlertToUser(userId: string, message: string) {
    try {
      if (!this.bot) return false;
      const user = await this.usersService.findById(userId);
      if (user && user.telegramChatId) {
        await this.bot.sendMessage(user.telegramChatId, message);
        return true;
      }
      return false;
    } catch (err: any) {
      this.logger.error(`Error sending alert: ${err?.message ?? err}`, err?.stack);
      return false;
    }
  }

  async sendMassAlert(message: string) {
    try {
      if (!this.bot) return 0;
      const users = await this.usersService.getApprovedUsers();
      let count = 0;
      for (const user of users) {
        if (user.telegramChatId) {
          await this.bot.sendMessage(user.telegramChatId, message);
          count++;
        }
      }
      this.logger.log(`Sent alert to ${count} users`);
      return count;
    } catch (err: any) {
      this.logger.error(`Error sending mass alert: ${err?.message ?? err}`, err?.stack);
      return 0;
    }
  }
}
