import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from 'src/login/login.service';
import { comparePassword } from 'src/utils/hashingFuncs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private loginService: LoginService,
  ) {}

  async LoginIfCredentials(name: string, password: string): Promise<any> {
    if (!name || !password) return null;

    const user = await this.loginService.findOne({
      where: {
        user_name: name,
      },
    });

    if (!user) {
      throw new HttpException(
        'User does not exists with that. Try again.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isSamePassword = await comparePassword({
      userPassword: password,
      originalPassword: user.user_password,
    });

    if (!isSamePassword)
      throw new HttpException(
        "Credentials don't match.",
        HttpStatus.BAD_REQUEST,
      );

    return this.jwtService.sign({
      userName: user.user_name,
      id: user.user_id,
    });
  }
}
