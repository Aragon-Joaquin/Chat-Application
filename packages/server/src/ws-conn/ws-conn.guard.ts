import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginService } from 'src/login/login.service';

@Injectable()
export class WsConnGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private loginService: LoginService,
  ) {}

  //! this is unsafe & very tricky (unless i implement a way to renue jwts)
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context?.switchToHttp()?.getRequest();
    const token: string | undefined = req?.handshake?.auth['Authorization'];

    if (token == undefined) return false;
    const decoded = this.authService.DecodeJWT(token);

    return !!(await this.loginService.FindOne({
      where: { user_id: decoded.id, user_name: decoded.userName },
    }));
  }
}
