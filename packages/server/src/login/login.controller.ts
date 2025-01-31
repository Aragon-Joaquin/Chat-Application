import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { UserDto } from './dto/user.dto';

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
    console.log(body);

    this.loginService.registerUser(body);
    return body;
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
