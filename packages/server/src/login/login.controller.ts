import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Request } from 'express';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  //send the credentials and verify them  with jwt, return jwt if okay
  @Post()
  @UseGuards(LocalAuthGuard)
  login(@Req() req: Request) {
    if ('user' in req) return JSON.stringify({ access_token: req.user });
    throw new UnauthorizedException('Request is not specified');
  }

  // register
  @Post('/register')
  async register(@Body() body: UserDto) {
    return await this.loginService.RegisterUser(body);
  }

  @Get('/getUser')
  @UseGuards(JWTAuthGuard)
  async getUser(@Req() req: Request) {
    const user = await this.loginService.FindOne({
      where: {
        user_id: req.user.id,
        user_name: req.user.userName,
      },
    });

    return JSON.stringify({
      user_name: user.user_name,
      user_id: user.user_id,
      profile_picture: user?.profile_picture ?? '',
    });
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
