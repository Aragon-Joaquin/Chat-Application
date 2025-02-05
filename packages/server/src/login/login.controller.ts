import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  //send the credentials and verify them  with jwt, return jwt if okay
  @Get()
  login(@Body(new ValidationPipe()) body: UserDto) {
    return body;
  }

  // register

  @Post()
  register(@Body() body: UserDto) {
    return this.loginService.registerUser(body);
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
