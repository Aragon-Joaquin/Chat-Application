import { Header, Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class FileStorageService {
  constructor() {}

  async returnFile(fileName: string) {
    if (fileName === '' || fileName == null) return null;
    try {
      const file = createReadStream(
        join(process.cwd(), `./uploads/${fileName}`),
      );
      return new StreamableFile(file, {
        disposition: `attachment; filename=${fileName}`,
      });
    } catch {
      return null;
    }
  }

  async returnMultipleFiles(files: string[]) {
    try {
      return files?.map((fileName) => {
        const file = createReadStream(
          join(process.cwd(), `./uploads/${fileName}`),
        );
        return new StreamableFile(file, {
          disposition: `attachment; filename=${fileName}`,
        });
      });
    } catch {
      return null;
    }
  }
}
