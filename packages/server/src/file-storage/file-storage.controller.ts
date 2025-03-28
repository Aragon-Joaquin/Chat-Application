import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { FileStorageService } from './file-storage.service';

@Controller('file-storage')
export class FileStorageController {
  constructor(private fileService: FileStorageService) {}

  @Get()
  async getImage(
    @Res({ passthrough: true }) res,
    @Query() query: { file: string },
  ) {
    const result = await this.fileService.returnFile(query?.file);
    if (result == undefined) return new BadRequestException('File not found.');

    res.set({
      'Content-Type': 'image/*;',
      'Content-Disposition': `attachment; filename="${query.file}"`,
    });

    return result;
  }

  /*
  ! im going to be honest.
  ! i just think this is impossible for now, i cant send multiple files and transform them into createObjectURL to be processed later as images
  ! i will be making a ton of single request for now with Promise.All() until i decipher this

  *possible solutions:
  - send a StreamableFile[] as json and then... ? 
  - 
  */

  @Post()
  async getMultipleImages(
    @Res({ passthrough: true }) res,
    @Body() body: { images: string[] },
  ) {
    const result = await this.fileService.returnMultipleFiles(body?.images);
    if (result == undefined) return new BadRequestException('Files not found.');

    res.set({
      'Content-Type': 'application/octet-stream;',
      'Content-Disposition': `attachment; filename="multipleImages"`,
    });
    return result;
  }
}
