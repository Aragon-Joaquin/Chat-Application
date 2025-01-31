import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInformation } from 'src/login/dto/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate({ userName, userPassword }: UserInformation): Promise<any> {
    const user = await this.authService.validateUserLogin(
      userName,
      userPassword,
    );
    if (!user) {
      throw new HttpException(
        'Credentials are wrong. Try again.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
