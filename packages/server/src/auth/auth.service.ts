import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from 'src/login/login.service';
import { getJWTSecret } from 'src/utils/getEnvVariables';
import { comparePassword } from 'src/utils/hashingFuncs';
import { JWT_DECODED_INFO } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private loginService: LoginService,
  ) {}

  async LoginIfCredentials(name: string, password: string): Promise<any> {
    if (!name || !password) return null;

    const user = await this.loginService.FindOne({
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
  async VerifyJWT(token: string): Promise<boolean> {
    const verifyIfTrue = this.jwtService.verify(token, {
      secret: getJWTSecret().JWT_SECRET,
    });

    if (!verifyIfTrue) return true;
    return false;
  }

  /**
   *
   * @param token: Just send the Authorizarion header which should be 'Bearer eyJhbGciOiJIUzI1NiIsInR...'. The function then splits the string to keep the token
   */
  DecodeJWT(authorization: string | null): JWT_DECODED_INFO {
    if (!authorization)
      throw new HttpException(
        'Auth header does not exists on the request',
        HttpStatus.BAD_REQUEST,
      );
    try {
      const user = this.jwtService.decode(authorization.split(' ')[1]); //split the token between 'Bearer' and the real jwt
      if (!user) throw new UnauthorizedException('User is not in room');
      return user;
    } catch (e) {
      throw new HttpException(
        'Error Decoding JWT',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
