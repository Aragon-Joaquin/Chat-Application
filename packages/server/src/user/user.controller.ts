import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JWTAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}
  // change profile picture for user - //!profile_picture means the name of the field in the HTML
  @Post('/uploadPhoto')
  @UseInterceptors(FileInterceptor('file'))
  async updatePfp(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return file;
  }

  @Get()
  async getUserInformation(@Req() req: Request) {
    return await this.userService.getUser(req.user['id']);
  }

  // @Post('logout')
  // logout(@Body() body) {
  //     return body;
  // }
}
