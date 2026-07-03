import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'https://weather-8-4t82.onrender.com/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    const { username, emails, id } = profile;
    const email = emails && emails[0] ? emails[0].value : `${username}@github.com`;
    const user = {
      githubId: id,
      email: email,
      name: username,
      provider: 'github',
    };
    const savedUser = await this.authService.validateOAuthUser(user);
    done(null, savedUser);
  }
}