import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { getJWTSecret } from 'src/utils/getEnvVariables';
import { LoginService } from 'src/login/login.service';
import { JWT_DECODED_INFO } from 'src/utils/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginService: LoginService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJWTSecret().JWT_SECRET,
      passReqToCallback: null,
    });
  }

  async validate(payload: JWT_DECODED_INFO) {
    if (!('userName' in payload) || !('id' in payload))
      throw new BadRequestException('Wrong JWT Shape.');

    await this.loginService.FindOne({ where: { user_id: payload.id } });

    return payload;
  }
}
