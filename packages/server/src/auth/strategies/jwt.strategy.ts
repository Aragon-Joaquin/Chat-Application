import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { getJWTSecret } from 'src/utils/getEnvVariables';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJWTSecret().JWT_SECRET,
      passReqToCallback: null,
    });
  }

  async validate(payload: any) {
    console.log('jwt payload', payload);

    return payload;
  }
}
