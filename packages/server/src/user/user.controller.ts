import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
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
    console.log({ file, asd: file.filename });
    return await this.userService.uploadProfilePic(req.user['id'], file);
  }

  @Get()
  async getUserInformation(@Req() req: Request) {
    const user = await this.userService.getUser(req.user['id']);
    if (user == undefined) throw new InternalServerErrorException();
    return user;
  }

  // @Post('logout')
  // logout(@Body() body) {
  //     return body;
  // }
}
