import { Injectable } from '@nestjs/common';
import { UserInformation } from 'src/login/dto/user.dto';
import { LoginService } from 'src/login/login.service';

@Injectable()
export class AuthService {
  constructor(private loginService: LoginService) {}

  async validateUserLogin(username: string, password: string): Promise<any> {}

  async hashPassword() {}
}
