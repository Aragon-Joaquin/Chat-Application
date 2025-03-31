import { UnprocessableEntityException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { diskStorage } from 'multer';

export const MAXIMUM_MB_PER_IMAGE = 3 as const;
export const TOTAL_MB = MAXIMUM_MB_PER_IMAGE * 10 * 10 * 10 * 10 * 10 * 10 * 10;

export const ALLOWED_MIMETYPES = ['image/png', 'image/jpeg'];
export const DESTINATION_FOLDER = './uploads' as const;

export const FOLDER_PATHS = {
  PFPS: 'profile_picture',
  IMGS: 'images',
} as const;

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

export const MULTER_OPTIONS = (
  subfolder: (typeof FOLDER_PATHS)[keyof typeof FOLDER_PATHS],
  maxFields?: number,
): MulterOptions => ({
  storage: diskStorage({
    destination: `${DESTINATION_FOLDER}/${subfolder}`,
    filename: VALIDATE_FILE,
  }),
  limits: {
    fieldNameSize: 60,
    fileSize: TOTAL_MB,
    fields: maxFields ?? 1,
  },
});
