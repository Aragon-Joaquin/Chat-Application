import { UnprocessableEntityException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { diskStorage } from 'multer';

export const oneKb = 1000 as const; // = 1000 is measured in bytes, so its 1kb
export const MAXIMUM_KB_PER_IMAGE = 500 as const; // its 4mb
export const TOTAL_MB = MAXIMUM_KB_PER_IMAGE * oneKb;

export const ALLOWED_MIMETYPES = ['image/png', 'image/jpeg'];
export const DESTINATION_FOLDER = './uploads' as const;

export const VALIDATE_FILE = (
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  if (!ALLOWED_MIMETYPES.includes(file.mimetype))
    return callback(
      new UnprocessableEntityException('File type must be PNG or JPEG'),
      '',
    );

  callback(null, `${Date.now()}-${file.originalname}`);
};

export const MULTER_OPTIONS = (maxFields?: number): MulterOptions => ({
  storage: diskStorage({
    destination: DESTINATION_FOLDER,
    filename: VALIDATE_FILE,
  }),
  limits: {
    fieldNameSize: 60,
    fileSize: TOTAL_MB,
    fields: maxFields ?? 1,
  },
});
