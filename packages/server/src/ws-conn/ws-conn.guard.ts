import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserInDB } from 'src/login/dto/user.dto';
import { LoginService } from 'src/login/login.service';

@Injectable()
export class WsConnGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private loginService: LoginService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToWs().getClient().handshake
      .headers.authorization;

    const decoded = this.authService.DecodeJWT(token);

    return !!(await this.loginService.findOne({
      where: { user_id: decoded.id, user_name: decoded.userName },
    }));
  }
}
