import { Module } from '@nestjs/common';
import { WsConnGateway } from './ws-conn.gateway';
import { RoomService } from 'src/room/room.service';
import { WsConnController } from './ws-conn.controller';
import { WsConnService } from './ws-conn.service';
import { LoginService } from 'src/login/login.service';
import { AuthService } from 'src/auth/auth.service';
import { RoomMessagesService } from 'src/room-messages/room-messages.service';

@Module({
  providers: [
    WsConnGateway,
    RoomService,
    WsConnService,
    LoginService,
    AuthService,
    RoomMessagesService,
  ],
  imports: [],
  controllers: [WsConnController],
  exports: [WsConnService],
})
export class WsConnModule {}
