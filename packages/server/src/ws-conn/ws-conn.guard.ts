import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { users } from 'src/entities';
import { UserInDB } from 'src/login/dto/user.dto';
import { LoginService } from 'src/login/login.service';
import { Repository } from 'typeorm';

@Injectable()
export class WsConnGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private loginService: LoginService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context
      .switchToWs()
      .getClient()
      .handshake.headers.authorization.split(' ')[1]; //the [0] is the Bearer thingy
    const decoded: Pick<UserInDB, 'userName' | 'id'> =
      this.authService.DecodeJWT(token);

    return !!(await this.loginService.findOne({
      where: { user_id: decoded.id, user_name: decoded.userName },
    }));
  }
}
