import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  WS_ACTIONS,
  WS_ENDPOINTS_EVENTS,
  WS_NAMESPACE,
  WS_PORT,
} from '@chat-app/utils/globalConstants';
import { WsConnGuard } from './ws-conn.guard';
import { AuthService } from 'src/auth/auth.service';
import { messages } from 'src/entities';
import { WsConnService } from './ws-conn.service';

@WebSocketGateway(WS_PORT, {
  namespace: WS_NAMESPACE,
  transports: ['websocket'],
})
@UseGuards(WsConnGuard)
export class WsConnGateway {
  @WebSocketServer() wss: Server;

  constructor(
    private authService: AuthService,
    private wsConnService: WsConnService,
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

    await this.wsConnService.FindUserInRoom(JWT_Info['id'], roomID);

    client.broadcast
      .to(roomID)
      .emit(WS_ENDPOINTS_EVENTS.MESSAGE, String(messageString));
  }

  @SubscribeMessage(WS_ACTIONS.JOIN)
  async handleJoinRoom(
    client: Socket,
    payload: { roomID: string; roomPassword: string },
  ) {
    const { roomID, roomPassword } = payload;
    const JWT_Info = this.getJWTHeader(client);

    // this cannot be Promised.all() since it need to verify first if the credentials are okay
    await this.wsConnService.JoinToNewRoom(roomID, JWT_Info, roomPassword);
    await client.join(roomID);

    this.wss
      .in(roomID)
      .emit(
        WS_ENDPOINTS_EVENTS.JOINED_ROOM,
        `${JWT_Info.userName} joined the room.`,
      );
  }

  @SubscribeMessage(WS_ACTIONS.JOIN_MULTIPLE)
  async handleJoinMultiple(client: Socket) {
    const JWT_Info = this.getJWTHeader(client);
    const rooms = await this.wsConnService.GetRoomsOfUser(JWT_Info.id);

    await client.join([...rooms.map((room) => room.room_id)]);
  }

  @SubscribeMessage(WS_ACTIONS.LEAVE)
  async handleLeaveRoom(client: Socket, roomID: string) {
    const JWT_Info = this.getJWTHeader(client);

    await Promise.all([
      this.wsConnService.LeaveRoom(JWT_Info.id, roomID),
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

    const message = await this.wsConnService.DeleteMessageInRoom(
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
