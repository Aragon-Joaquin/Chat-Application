import { extname, join } from 'path';
import { FOLDER_PATHS } from './MulterProps';
import { readFileSync } from 'fs';

interface fileToBase64Props {
  folderPath: (typeof FOLDER_PATHS)[keyof typeof FOLDER_PATHS];
  fileName: string;
}

export function fileToBase64({ folderPath, fileName }: fileToBase64Props) {
  try {
    const path = join(process.cwd(), 'uploads', folderPath, fileName ?? '404');
    const gotImage = readFileSync(path);
    const MIMETYPE = extname(path)?.substring(1);

    if (gotImage == null || MIMETYPE == null) return null;
    const base64String = Buffer.from(gotImage).toString('base64');

    return `data:image/${MIMETYPE.toLowerCase()};base64,${base64String}`;
  } catch {
    return null;
  }
}
