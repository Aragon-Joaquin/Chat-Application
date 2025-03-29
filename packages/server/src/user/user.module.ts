import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { file_storage, users } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { FOLDER_PATHS, MULTER_OPTIONS } from 'src/utils/MulterProps';

@Module({
  imports: [
    TypeOrmModule.forFeature([users, file_storage]),
    MulterModule.register(MULTER_OPTIONS(FOLDER_PATHS.PFPS)),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
