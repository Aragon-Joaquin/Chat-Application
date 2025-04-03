import { BadRequestException, HttpStatus, UseGuards } from '@nestjs/common';
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
import { createErrorMessage, MEDIA_PAYLOADS } from './utils';
import { UUID_TYPE } from 'src/utils/types';
import { FileStorageService } from 'src/file-storage/file-storage.service';
import { FOLDER_PATHS } from 'src/utils/MulterProps';
import { readFile, readFileSync } from 'fs';
import { join } from 'path';

@UseGuards(WsConnGuard)
@WebSocketGateway(WS_PORT, {
  cors: {
    origin: '*',
  },
  namespace: WS_NAMESPACE,
  transports: ['websocket'],
})
export class WsConnGateway {
  @WebSocketServer() wss: Server;

  constructor(
    private authService: AuthService,
    private wsConnService: WsConnService,
    private fileStorageService: FileStorageService,
  ) {}

  //! utils ⬇
  returnCustomError = (
    clientID: Socket['id'],
    errorMessage: Parameters<typeof createErrorMessage>,
  ) =>
    this.wss
      .in(clientID)
      .emit(
        WS_ENDPOINTS_EVENTS.ERROR_CHANNEL,
        createErrorMessage(
          errorMessage[0] ?? 'Unknown',
          errorMessage[1] ?? HttpStatus.NOT_IMPLEMENTED,
          errorMessage[2],
        ),
      );

  getJWTHeader = (client: Socket) =>
    this.authService.DecodeJWT(client?.handshake?.auth['Authorization']);

  //! endpoints ⬇
  @SubscribeMessage(WS_ACTIONS.SEND)
  async handleMessage(
    client: Socket,
    payload: {
      messageString: string;
      messageID?: string;
      roomID: string;
      file?: UUID_TYPE;
    },
  ) {
    const { roomID, messageString, messageID, file } = payload;

    if (messageString === '')
      return this.returnCustomError(client.id, [
        'Message not defined',
        HttpStatus.BAD_REQUEST,
        { message_id: messageID },
      ]);

    const JWT_Info = this.getJWTHeader(client);

    const userInRoom = await this.wsConnService.FindUserInRoom(
      JWT_Info['id'],
      roomID,
    );

    if (userInRoom == undefined)
      return this.returnCustomError(client.id, [
        "You're not in this room",
        HttpStatus.FORBIDDEN,
      ]);

    const newMessage = await this.wsConnService.CreateMessageToRoom(
      { message_content: messageString, file_id: file },
      roomID,
      JWT_Info['id'],
    );

    try {
      client.broadcast.to(roomID).emit(
        WS_ENDPOINTS_EVENTS.MESSAGE,
        JSON.stringify({
          new_message: newMessage.message,
          from_user_id: JWT_Info['id'],
          date_sended: newMessage?.date_sended,
          roomID,
        }),
      );

      this.wss.in(client.id).emit(
        WS_ENDPOINTS_EVENTS.MESSAGE,
        JSON.stringify({
          new_message: newMessage.message,
          from_user_id: JWT_Info['id'],
          date_sended: newMessage?.date_sended,
          roomID,
          client_id: messageID,
        }),
      );
    } catch {
      return this.returnCustomError(client.id, [
        "Message couldn't be sended.",
        HttpStatus.BAD_REQUEST,
        { message_id: messageID },
      ]);
    }
  }

  @SubscribeMessage(WS_ACTIONS.SEND_MEDIA)
  async handleSendMedia(
    client: Socket,
    payload: { type: MEDIA_PAYLOADS; file: string },
  ) {
    console.log({ payload });
    console.log({ room: payload?.type });

    const { type, file } = payload;
    const JWT_Info = this.getJWTHeader(client);

    if (!('action' in type))
      return this.returnCustomError(client.id, [
        'Action is missing',
        HttpStatus.BAD_REQUEST,
      ]);

    switch (type.action) {
      case 'roomPicture': {
        this.wss.in(type.roomPicture.roomID).emit(
          WS_ENDPOINTS_EVENTS.MEDIA_CHANNEL,
          JSON.stringify({
            type: 'roomPicture',
            roomID: type.roomPicture.roomID,
            fileSrc: file,
          }),
        );
        break;
      }
      case 'userPicture': {
        client.emit(
          WS_ENDPOINTS_EVENTS.MEDIA_CHANNEL,
          JSON.stringify({
            type: 'userPicture',
            clientID: JWT_Info.id,
            fileSrc: file,
          }),
        );
        break;
      }
      case 'chatIMG': {
        if (file == null || file == '')
          return this.returnCustomError(client.id, [
            "File wasn't given.",
            HttpStatus.BAD_REQUEST,
          ]);

        try {
          const gotImage = readFileSync(
            join(process.cwd(), 'uploads', FOLDER_PATHS.IMGS, file ?? '404'),
          );
          if (gotImage == null) return null;

          const base64String = Buffer.from(gotImage).toString('base64');

          this.wss.in(type.chatIMG.roomID).emit(
            WS_ENDPOINTS_EVENTS.MEDIA_CHANNEL,
            JSON.stringify({
              type: 'chatIMG',
              clientID: JWT_Info.id,
              roomID: type.chatIMG.roomID,
              fileSrc: `data:image/${'png'};base64,${base64String}`,
            }),
          );
        } catch {
          return this.returnCustomError(client.id, [
            'Internal Server Error.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ]);
        }

        break;
      }

      default: {
        return this.returnCustomError(client.id, [
          'Unknown action.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ]);
      }
    }
  }

  @SubscribeMessage(WS_ACTIONS.CREATE)
  async handleCreateRoom(
    client: Socket,
    payload: { roomName: string; roomPassword?: string },
  ) {
    const { roomName, roomPassword } = payload;

    const JWT_Info = this.getJWTHeader(client);

    const roomAndJoin = await this.wsConnService.CreateAndJoinRoom(
      { room_name: roomName, room_password: roomPassword },
      JWT_Info,
    );

    if (roomAndJoin == undefined || roomAndJoin.room_id == undefined)
      return this.returnCustomError(client.id, [
        'RoomName cannot be empty',
        HttpStatus.BAD_REQUEST,
      ]);

    await client.join(roomAndJoin.room_id);
    this.wss
      .to(client.id)
      .emit(WS_ENDPOINTS_EVENTS.CREATE_ROOM, JSON.stringify(roomAndJoin));
  }

  @SubscribeMessage(WS_ACTIONS.JOIN)
  async handleJoinRoom(
    client: Socket,
    payload: { roomID: string; roomPassword?: string },
  ) {
    const { roomID, roomPassword } = payload;
    const JWT_Info = this.getJWTHeader(client);

    try {
      const [roomExists, userInfo] = await Promise.all([
        this.wsConnService.JoinToNewRoom(roomID, JWT_Info, roomPassword),
        this.wsConnService.GetUser(JWT_Info['id']),
      ]);
      console.log(roomExists);

      if (roomExists == undefined || userInfo == undefined)
        return this.returnCustomError(client.id, [
          'Room does not exists with that ID',
          HttpStatus.BAD_REQUEST,
        ]);

      await client.join(roomID);

      this.wss.to(client.id).emit(
        WS_ENDPOINTS_EVENTS.JOINED_ROOM,
        JSON.stringify({
          room_id: roomExists.room_id,
          room_name: roomExists.room_name,
          room_description: roomExists?.room_description,
          created_at: roomExists.created_at,
          room_picture: roomExists.room_picture?.file_src,
        }),
      );

      client.broadcast.emit(
        WS_ENDPOINTS_EVENTS.JOINED_ROOM,
        JSON.stringify({
          room_id: roomExists.room_id,
          userInfo,
        }),
      );
    } catch (error) {
      if (error instanceof BadRequestException)
        return this.returnCustomError(client.id, [
          error.message ?? 'Unknown error.',
          HttpStatus.BAD_REQUEST,
        ]);
    }
  }

  @SubscribeMessage(WS_ACTIONS.JOIN_MULTIPLE)
  async handleJoinMultiple(client: Socket) {
    const JWT_Info = this.getJWTHeader(client);
    const rooms = await this.wsConnService.GetRoomsOfUser(JWT_Info.id);

    if (!rooms.length) return;
    await client.join([...rooms.map((room) => room.room_id)]);
  }

  @SubscribeMessage(WS_ACTIONS.LEAVE)
  async handleLeaveRoom(client: Socket, payload: { roomID: string }) {
    const { roomID } = payload;
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
