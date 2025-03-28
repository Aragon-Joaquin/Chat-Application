import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'node:path';
import { FOLDER_PATHS } from './utils/MulterProps';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PUBLIC_FOLDER_NAME } from '@chat-app/utils/globalConstants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
    }),
  );
  app.useStaticAssets(join(process.cwd(), 'uploads', FOLDER_PATHS.PFPS), {
    prefix: PUBLIC_FOLDER_NAME,
  });

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
