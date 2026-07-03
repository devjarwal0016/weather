import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res) {
    const user = req.user;
    const loginData = await this.authService.login(user);
    
    // Use environment variable for frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${loginData.access_token}&user=${encodeURIComponent(
        JSON.stringify(loginData.user)
      )}`
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req, @Res() res) {
    const user = req.user;
    const loginData = await this.authService.login(user);
    
    // Use environment variable for frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${loginData.access_token}&user=${encodeURIComponent(
        JSON.stringify(loginData.user)
      )}`
    );
  }
}