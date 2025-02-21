import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  //send the credentials and verify them  with jwt, return jwt if okay
  @Post()
  @UseGuards(LocalAuthGuard)
  login(@Req() req: Request) {
    if ('user' in req) return req.user;
    throw new UnauthorizedException('Request is not specified');
  }

  // register

  @Post('/register')
  register(@Body() body: UserDto) {
    return this.loginService.RegisterUser(body);
  }

  // change password
  @Patch()
  changePassword(@Body() body) {
    return body;
  }

  // @Post('logout')
  // logout(@Body() body) {
  //     return body;
  // }
}
