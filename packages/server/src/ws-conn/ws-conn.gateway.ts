import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ROLES,
  WS_ACTIONS,
  WS_ENDPOINTS_EVENTS,
  WS_NAMESPACE,
  WS_PORT,
} from 'src/utils/constants';
import { WsConnGuard } from './ws-conn.guard';
import { RoomService } from 'src/room/room.service';
import { AuthService } from 'src/auth/auth.service';
import { messages } from 'src/entities';

@WebSocketGateway(WS_PORT, {
  namespace: WS_NAMESPACE,
  transports: ['websocket'],
})
@UseGuards(WsConnGuard)
export class WsConnGateway {
  @WebSocketServer() wss: Server;

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
  ) {}

  getJWTHeader = (client: Socket) =>
    this.authService.DecodeJWT(client.handshake.headers.authorization);

  @SubscribeMessage(WS_ACTIONS.SEND)
  async handleMessage(
    client: Socket,
    payload: { roomID: string; messageString: string },
  ) {
    const { roomID, messageString } = payload;

    const JWT_Info = this.getJWTHeader(client);

    await this.roomService.FindUserInRoom(JWT_Info['id'], roomID);

    client.broadcast
      .to(roomID)
      .emit(WS_ENDPOINTS_EVENTS.MESSAGE, String(messageString));
  }

  @SubscribeMessage(WS_ACTIONS.JOIN)
  async handleJoinRoom(
    client: Socket,
    roomData: { roomID: string; roomPassword: string },
  ) {
    const { roomID, roomPassword } = roomData;
    const JWT_Info = this.getJWTHeader(client);

    await Promise.all([
      this.roomService.JoinRoom(roomID, roomPassword, JWT_Info),
      client.join(roomID),
    ]);

    this.wss
      .in(roomID)
      .emit(
        WS_ENDPOINTS_EVENTS.JOINED_ROOM,
        `${JWT_Info.userName} joined the room.`,
      );
  }

  @SubscribeMessage(WS_ACTIONS.LEAVE)
  async handleLeaveRoom(client: Socket, roomID: string) {
    const JWT_Info = this.getJWTHeader(client);

    await Promise.all([
      this.roomService.LeaveRoom(JWT_Info.id, roomID),
      client.leave(roomID),
    ]);

    this.wss
      .in(roomID)
      .emit(
        WS_ENDPOINTS_EVENTS.LEAVED_ROOM,
        `${JWT_Info.userName} has leaved the room.`,
      );
  }

  @SubscribeMessage(WS_ACTIONS.DELETE)
  async handleDeleteMessages(
    client: Socket,
    payload: { messageID: messages['message_id']; roomID: string },
  ) {
    const { messageID, roomID } = payload;
    const JWT_Info = this.getJWTHeader(client);

    const message = await this.roomService.DeleteMessageInRoom(
      JWT_Info.id,
      roomID,
      messageID,
    );

    this.wss.in(roomID).emit(WS_ENDPOINTS_EVENTS.DELETE_MESSAGE, {
      messageID: message.message_id,
      sender: message.sender_id,
    });
  }
}
