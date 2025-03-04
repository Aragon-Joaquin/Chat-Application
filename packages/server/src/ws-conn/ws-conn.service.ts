import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MAXIMUM_ROOMS_PER_USER } from '@chat-app/utils/globalConstants';
import { messages, room, users_in_room } from 'src/entities';
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
    const roomExisting = await this.roomService.FindOne({
      where: { room_id: id },
    });

    return await this.usersRoomsService.VerifyAndJoinRoom(
      roomExisting,
      userInfo,
      password,
    );
  }

  async LeaveRoom(user: JWT_DECODED_INFO['id'], roomID: string) {
    const userExists = await this.FindUserInRoom(user, roomID);
    await this.usersRoomsService.DeleteFromRoom(userExists);
  }

  async RoomHistory(user: JWT_DECODED_INFO, body?: RoomHistoryDto) {
    const room = await this.roomService.FindOne({
      where: { room_id: body.roomName },
    });

    const [history, _] = await Promise.all([
      this.roomMsgs.InnerJoinRoomMessages(body),
      this.FindUserInRoom(user['id'], room['room_id']),
    ]);

    return history;
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
    const userRooms = await this.dataSource.manager.countBy(users_in_room, {
      user_id: token,
    });

    return userRooms >= MAXIMUM_ROOMS_PER_USER ? true : false;
  }

  async GetRoomMessages(
    userID: JWT_DECODED_INFO['id'],
    rooms: Array<users_in_room> | Array<room>,
    limit?: number,
  ) {
    if (!rooms || !rooms.length) return null;

    const getRooms = rooms?.map((room) => `('${room.room_id}')::varchar`);

    try {
      //i just hate orms at this point
      return await this.dataSource.query(`
        SELECT room.room_id, room.room_name, room.room_description, room.created_at, room.room_picture from room
        LEFT JOIN users_in_room ON room.room_id = users_in_room.room_id
        LEFT JOIN room_messages ON users_in_room.room_id = room_messages.which_room 
        WHERE users_in_room.room_id IN (${getRooms}) AND users_in_room.user_id = (${userID})::integer;
        `);
    } catch {
      return null;
    }
  }
}
