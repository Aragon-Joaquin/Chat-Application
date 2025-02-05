import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'userName', passwordField: 'userPassword' });
  }

  async validate(userName: string, userPassword: string): Promise<any> {
    const jwtHash = await this.authService.LoginIfCredentials(
      userName,
      userPassword,
    );
    if (!jwtHash) throw new UnauthorizedException();
    return jwtHash;
  }
}
