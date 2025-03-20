import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { users } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { MULTER_OPTIONS } from 'src/utils/MulterProps';

@Module({
  imports: [
    TypeOrmModule.forFeature([users]),
    MulterModule.register(MULTER_OPTIONS()),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
