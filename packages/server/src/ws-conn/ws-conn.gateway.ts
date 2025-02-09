import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WS_ACTIONS, WS_NAMESPACE, WS_PORT } from 'src/utils/constants';
import { messageWSShape } from './types.d';
import { WsConnGuard } from './ws-conn.guard';
import { WsConnService } from './ws-conn.service';
import { RoomService } from 'src/room/room.service';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway(WS_PORT, {
  namespace: WS_NAMESPACE,
  transports: ['websocket'],
})
@UseGuards(WsConnGuard)
export class WsConnGateway {
  @WebSocketServer() wss: Server;

  constructor(
    private roomService: RoomService,
    private wsService: WsConnService,
    private authService: AuthService,
  ) {}

  @SubscribeMessage(WS_ACTIONS.SEND)
  handleMessage(client: Socket, payload: messageWSShape): string {
    return 'Hello world!';
  }

  @SubscribeMessage(WS_ACTIONS.JOIN)
  async handleJoinRoom(
    client: Socket,
    roomData: { roomID: string; roomPassword: string },
  ) {
    const { roomID, roomPassword } = roomData;
    const JWT_Info = this.authService.DecodeJWT(
      client.handshake.headers.authorization,
    );
    try {
      await this.roomService.JoinRoom(roomID, roomPassword, {
        userName: JWT_Info.userName,
        id: JWT_Info.id,
      });
      await client.join(roomID);
      this.wss
        .in(roomID)
        .emit('JoinEvent', `${JWT_Info.userName} joined the room.`);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // @SubscribeMessage(WS_ACTIONS.LEAVE)

  // @SubscribeMessage(WS_ACTIONS.DELETE)
}
