import { forwardRef, Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { file_storage, room, room_messages } from 'src/entities';
import { RoomController } from './room.controller';
import { WsConnModule } from 'src/ws-conn/ws-conn.module';
import { UserModule } from 'src/user/user.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([room, file_storage, room_messages]),
    UserModule,
    forwardRef(() => WsConnModule),
    MulterModule.register(),
  ],
  providers: [RoomService],
  exports: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
