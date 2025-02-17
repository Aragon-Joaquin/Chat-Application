import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MAXIMUM_ROOMS_PER_USER } from '@chat-app/utils/globalConstants';
import { AuthService } from 'src/auth/auth.service';
import { messages, room, users_in_room } from 'src/entities';
import { LoginService } from 'src/login/login.service';
import { RoomMessagesService } from 'src/room-messages/room-messages.service';
import { RoomHistoryDto } from 'src/room/dto/roomHistory.dto';
import { RoomService } from 'src/room/room.service';
import { UsersRoomsService } from 'src/users-rooms/users-rooms.service';
import { JWT_DECODED_INFO } from 'src/utils/types';
import { DataSource } from 'typeorm';

@Injectable()
export class WsConnService {
  constructor(
    private roomService: RoomService,
    private loginService: LoginService,
    private authService: AuthService,
    private roomMsgs: RoomMessagesService,
    private usersRoomsService: UsersRoomsService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  GetRoomsOfUser = async (user: JWT_DECODED_INFO['id']) =>
    await this.usersRoomsService.GetUsersRooms(user);

  async JoinToNewRoom(
    id: string,
    userInfo: JWT_DECODED_INFO,
    password?: string,
  ) {
    const [roomExisting, user] = await Promise.all([
      this.roomService.FindOne({ where: { room_id: id } }),
      this.loginService.FindOne({
        where: { user_name: userInfo.userName, user_id: userInfo.id },
      }),
    ]);

    return await this.usersRoomsService.VerifyAndJoinRoom(
      roomExisting,
      user,
      password,
    );
  }

  async LeaveRoom(user: JWT_DECODED_INFO['id'], roomID: string) {
    const userExists = await this.FindUserInRoom(user, roomID);
    await this.usersRoomsService.DeleteFromRoom(userExists);
  }

  async RoomHistory(token: string, body?: RoomHistoryDto) {
    const user = this.authService.DecodeJWT(token);
    const room = await this.roomService.FindOne({
      where: { room_id: body.roomName },
    });

    const [history, _] = await Promise.all([
      this.roomMsgs.InnerJoinRoomMessages(body),
      this.FindUserInRoom(user['id'], room['room_id']),
    ]);

    return history;
  }

  async GetAllRoomMessages(JWT_INFO: JWT_DECODED_INFO['id'], limit?: number) {
    const userInRooms = await this.GetRoomsOfUser(JWT_INFO);
    return await this.roomMsgs.GetRoomMessages(userInRooms, limit);
  }

  async FindUserInRoom(
    userID: JWT_DECODED_INFO['id'],
    roomID: room['room_id'],
  ) {
    return await this.usersRoomsService.GetUsersOneRoom(userID, roomID);
  }

  async DeleteMessageInRoom(
    userID: JWT_DECODED_INFO['id'],
    roomID: room['room_id'],
    messageID: messages['message_id'],
  ) {
    const [userExists, message] = await Promise.all([
      this.FindUserInRoom(userID, roomID),
      this.roomMsgs.FindMessageInRoom({ messageID, roomID }),
    ]);

    if (typeof userExists == 'object') return;
    return await this.roomMsgs.DeleteMessageInRoom(userExists, message);
  }

  /**
   * @returns True if it has exceeded the maximum amount of rooms the user can join. False otherwise
   */
  async hasExceededMaxRooms(token: JWT_DECODED_INFO['id']): Promise<boolean> {
    const user = await this.loginService.FindOne({ where: { user_id: token } });
    const userRooms = await this.dataSource.manager.countBy(users_in_room, {
      user_id: user.user_id,
    });

    return userRooms >= MAXIMUM_ROOMS_PER_USER ? true : false;
  }
}
