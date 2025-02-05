import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { getJWTSecret } from 'src/utils/getEnvVariables';
import { UserInformation } from 'src/login/dto/user.dto';
import { JWT_NAME_SERVICE } from '../utils/constantsStategies';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_NAME_SERVICE) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJWTSecret().JWT_SECRET,
    });
  }

  async validate(payload: Omit<UserInformation, 'profilePicture'>) {
    console.log('payload from validate', payload);
    const { userName, userPassword } = payload;
    return { userName, userPassword };
  }
}
