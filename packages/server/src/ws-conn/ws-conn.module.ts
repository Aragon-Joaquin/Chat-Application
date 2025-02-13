import { Module } from '@nestjs/common';
import { WsConnGateway } from './ws-conn.gateway';
import { RoomService } from 'src/room/room.service';

@Module({
  providers: [WsConnGateway, RoomService],
  imports: [],
})
export class WsConnModule {}
