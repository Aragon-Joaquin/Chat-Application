import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { users } from 'src/entities';
import { UserInformation } from 'src/login/dto/user.dto';
import { LoginService } from 'src/login/login.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private loginService: LoginService,
  ) {}

  async findUserBy({
    condition,
    userField,
  }: {
    condition: string;
    userField: string | number;
  }): Promise<users> {
    if (!condition || !userField)
      throw new HttpException(
        'Missing arguments on userField.',
        HttpStatus.BAD_REQUEST,
      );

    return await this.loginService.findOne({
      where: {
        [condition]: userField,
      },
    });
  }

  LoginAndJWT({ userName, userPassword }: UserInformation) {
    return {
      access_token: this.jwtService.sign({ userName, userPassword }),
    };
  }
}
