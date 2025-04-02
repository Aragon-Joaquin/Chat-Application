import { Header, Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';
import { FOLDER_PATHS } from 'src/utils/MulterProps';

@Injectable()
export class FileStorageService {
  constructor() {}

  returnFile(
    fileName: string,
    folder: (typeof FOLDER_PATHS)[keyof typeof FOLDER_PATHS] = 'profile_picture',
  ) {
    if (fileName === '' || fileName == null) return null;
    try {
      const file = createReadStream(
        join(process.cwd(), `./uploads/${folder}/${fileName}`),
      );
      return new StreamableFile(file, {
        disposition: `attachment; filename=${fileName}`,
      });
    } catch {
      return null;
    }
  }
}
