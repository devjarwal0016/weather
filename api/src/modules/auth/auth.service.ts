import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthUser(profileData: any) {
    let user;
    
    if (profileData.googleId) {
      user = await this.usersService.findByGoogleId(profileData.googleId);
    } else if (profileData.githubId) {
      user = await this.usersService.findByGithubId(profileData.githubId);
    }

    if (!user) {
      user = await this.usersService.createUser({
        ...profileData,
        status: 'pending',
      });
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      sub: user._id,
      email: user.email,
      status: user.status,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        status: user.status,
      },
    };
  }
}