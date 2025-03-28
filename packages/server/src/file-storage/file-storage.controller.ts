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
}
