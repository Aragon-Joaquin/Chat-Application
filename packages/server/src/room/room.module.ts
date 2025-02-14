import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { room } from 'src/entities';
import { RoomController } from './room.controller';
import { WsConnService } from 'src/ws-conn/ws-conn.service';

@Module({
  imports: [TypeOrmModule.forFeature([room])],
  providers: [RoomService, WsConnService],
  exports: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
