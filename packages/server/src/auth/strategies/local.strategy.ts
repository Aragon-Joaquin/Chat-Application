import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { comparePassword } from 'src/utils/hashingFuncs';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'userName', passwordField: 'userPassword' });
  }

  async validate(userName: string, userPassword: string): Promise<any> {
    console.log({ userName, userPassword });

    const user = await this.authService.findUserBy({
      condition: 'user_name',
      userField: userName,
    });

    if (!user) {
      throw new HttpException(
        'Credentials are wrong. Try again.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isSamePassword = await comparePassword({
      userPassword: userPassword,
      originalPassword: user.user_password,
    });

    if (!isSamePassword)
      throw new HttpException(
        "Credentials don't match.",
        HttpStatus.BAD_REQUEST,
      );

    return true;
  }
}
