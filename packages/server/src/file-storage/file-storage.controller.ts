import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { Response } from 'express';

@Controller('file-storage')
export class FileStorageController {
  constructor(private fileService: FileStorageService) {}

  @Get()
  async getImage(
    @Res({ passthrough: true }) res: Response,
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
