import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import { getJWTSecret } from 'src/utils/getEnvVariables';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginModule } from 'src/login/login.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    LoginModule,
    PassportModule,
    JwtModule.register({
      secret: getJWTSecret().JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
