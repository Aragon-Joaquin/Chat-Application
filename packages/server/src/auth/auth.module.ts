import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginService } from 'src/login/login.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  providers: [AuthService, LocalStrategy],
  imports: [LoginService, PassportModule],
})
export class AuthModule {}
