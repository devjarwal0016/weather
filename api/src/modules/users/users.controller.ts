import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('test')  // ← ADD THIS
  async test() {
    return { message: 'Users controller is working!' };
  }

  @Get('pending')
  async getPendingUsers() {
    return await this.usersService.getPendingUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Post('approve')
  async approveUser(@Body() body: { userId: string }) {
    return await this.usersService.approveUser(body.userId);
  }
}