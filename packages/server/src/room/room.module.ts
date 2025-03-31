import { forwardRef, Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { file_storage, room } from 'src/entities';
import { RoomController } from './room.controller';
import { WsConnModule } from 'src/ws-conn/ws-conn.module';
import { UserModule } from 'src/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { MULTER_OPTIONS } from 'src/utils/MulterProps';

@Module({
  imports: [
    TypeOrmModule.forFeature([room, file_storage]),
    UserModule,
    forwardRef(() => WsConnModule),
    MulterModule.register(MULTER_OPTIONS('profile_picture')),
  ],
  providers: [RoomService],
  exports: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
