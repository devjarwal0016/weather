import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userData: any) {
    const newUser = new this.userModel(userData);
    return await newUser.save();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findByGoogleId(googleId: string) {
    return await this.userModel.findOne({ googleId });
  }

  async findByGithubId(githubId: string) {
    return await this.userModel.findOne({ githubId });
  }

  async getPendingUsers() {
    return await this.userModel.find({ status: 'pending' });
  }

  async approveUser(userId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { status: 'approved' },
      { new: true }
    );
  }

  async findById(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      console.log('Error finding user:', error);
      return null;
    }
  }

  async getApprovedUsers() {
    return await this.userModel.find({ status: 'approved' });
  }

  async saveTelegramId(userId: string, chatId: string) {
    return await this.userModel.findByIdAndUpdate(userId, {
      telegramChatId: chatId
    });
  }
}