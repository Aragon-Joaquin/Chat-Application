import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MULTER_OPTIONS } from '../utils/MulterProps';

@Controller('user')
@UseGuards(JWTAuthGuard)
export class UserController {
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

  // @Post('logout')
  // logout(@Body() body) {
  //     return body;
  // }
}
