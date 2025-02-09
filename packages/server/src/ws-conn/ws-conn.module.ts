import { Module } from '@nestjs/common';
import { WsConnGateway } from './ws-conn.gateway';
import { WsConnService } from './ws-conn.service';
import { RoomService } from 'src/room/room.service';

@Module({
  providers: [WsConnGateway, WsConnService, RoomService],
  imports: [],
})
export class WsConnModule {}
