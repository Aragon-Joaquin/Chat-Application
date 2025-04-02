import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  MAX_MESSAGES_PER_REQ,
  MAXIMUM_ROOMS_PER_USER,
} from '@chat-app/utils/globalConstants';
import {
  messages,
  room,
  room_messages,
  users,
  users_in_room,
} from 'src/entities';
import { RoomMessagesService } from 'src/room-messages/room-messages.service';
import { RoomHistoryDto } from 'src/room/dto/roomHistory.dto';
import { RoomService } from 'src/room/room.service';
import { UsersRoomsService } from 'src/users-rooms/users-rooms.service';
import { JWT_DECODED_INFO } from 'src/utils/types';
import { DataSource } from 'typeorm';
import { RoomDto } from 'src/room/dto/room.dto';
import { roomInfo, userInfo } from './utils';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WsConnService {
  constructor(
    private roomService: RoomService,
    private roomMsgs: RoomMessagesService,
    private usersRoomsService: UsersRoomsService,
    private userService: UserService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  //! utils ⬇
  GetRoomsOfUser = async (user: JWT_DECODED_INFO['id']) =>
    await this.usersRoomsService.GetUsersRooms(user);

  /**
   * @returns True if it has exceeded the maximum amount of rooms the user can join. False otherwise
   */
  async hasExceededMaxRooms(token: JWT_DECODED_INFO['id']): Promise<boolean> {
    const userRooms = await this.dataSource.manager.countBy(users_in_room, {
      user_id: token,
    });

    return userRooms >= MAXIMUM_ROOMS_PER_USER ? true : false;
  }

  GetUser = async (user: JWT_DECODED_INFO['id']) =>
    await this.userService.getUser(user);

  //! rooms methods ⬇
  async JoinToNewRoom(
    id: string,
    userInfo: JWT_DECODED_INFO,
    password?: string,
  ) {
    const roomExisting = await this.roomService.FindOne({ room_id: id });

    if (!roomExisting) return null;

    await this.usersRoomsService.VerifyAndJoinRoom(
      roomExisting,
      userInfo,
      password,
    );

    return roomExisting;
  }

  async LeaveRoom(user: JWT_DECODED_INFO['id'], roomID: string) {
    const userExists = await this.FindUserInRoom(user, roomID);
    await this.usersRoomsService.DeleteFromRoom(userExists);
  }

  async RoomHistory(user: JWT_DECODED_INFO['id'], body?: RoomHistoryDto) {
    const room = await this.FindUserInRoom(user, body.room_id);
    try {
      const messages: Array<messages> = await this.dataSource.query(`
        SELECT * FROM (
          SELECT m.message_id, rm.which_room, rm.date_sended, m.message_content, fis.file_src as file_id, rm.sender_id 
            FROM room_messages rm
            INNER JOIN messages m ON rm.message_id = m.message_id
            LEFT JOIN file_storage fis ON m.file_id = fis.file_id
            WHERE rm.which_room = '${room.room_id}'::varchar ORDER BY rm.date_sended DESC OFFSET ${body.offset}::integer
        ) subquery ORDER BY subquery.date_sended ASC
        `);

      return {
        room_id: room?.room_id,
        messages,
      };
    } catch {
      return null;
    }
  }

  async FindUserInRoom(
    userID: JWT_DECODED_INFO['id'],
    roomID: room['room_id'],
  ) {
    return await this.usersRoomsService.GetUsersOneRoom(userID, roomID);
  }

  async CreateAndJoinRoom(roomBody: RoomDto, user: JWT_DECODED_INFO) {
    if (roomBody['room_name'] == undefined) return null;

    const roomCreated: Omit<room, 'room_password'> = (
      await this.roomService.CreateRoom(roomBody)
    ).raw[0];

    if (roomCreated == undefined) return null;

    try {
      await this.usersRoomsService.JoinRoomONCreation(
        roomCreated.room_id,
        user,
      );
      return roomCreated;
    } catch {
      return null;
    }
  }

  //! messages methods ⬇
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

  async getUserByMessageID(messageID: messages['message_id']) {
    try {
      const usersMessage = await this.dataSource.query(`
        SELECT users.user_name, users.profile_picture, users.user_id FROM room_messages 
        LEFT JOIN users ON room_messages.sender_id = users.user_id WHERE room_messages.message_id = '${messageID}'::uuid;`);
      return usersMessage[0];
    } catch {
      return null;
    }
  }

  async CreateMessageToRoom(
    messageProps: Pick<messages, 'message_content' | 'file_id'>,
    roomID: room['room_id'],
    userID: users['user_id'],
  ): Promise<{
    message: Partial<messages>;
    date_sended: room_messages['date_sended'];
  }> {
    const { message_content, file_id } = messageProps;
    if (message_content == undefined && file_id == undefined) return;

    try {
      const messageCreated = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(messages)
        .values({
          ...(message_content != undefined && {
            message_content: message_content,
          }),
          ...(file_id != undefined && {
            file_id: file_id,
          }),
        })
        .returning('*')
        .execute();

      const roomMessage = await this.roomMsgs.InsertMessageInRoom(
        messageCreated.raw[0].message_id,
        userID,
        roomID,
      );

      return {
        message: {
          message_content: messageCreated.raw[0]?.message_content,
          file_id: messageCreated.raw[0]?.file_id,
          message_id: messageCreated.raw[0]?.message_id,
        },
        date_sended: roomMessage.raw[0]?.date_sended,
      };
    } catch {
      return null;
    }
  }

  async GetRoomMessages(
    userID: JWT_DECODED_INFO['id'],
    rooms: Array<users_in_room> | Array<room>,
    limit?: number,
  ) {
    if (!rooms || !rooms.length) return null;

    const getRooms = rooms?.map((room) => `('${room.room_id}')::varchar`);

    try {
      const roomInfo: room[] | [] = await this.dataSource.query(`
        SELECT room.room_id, room.room_name, room.room_description, room.created_at, file_storage.file_src as room_picture from room
        LEFT JOIN users_in_room ON room.room_id = users_in_room.room_id
        LEFT JOIN room_messages ON users_in_room.room_id = room_messages.which_room
        LEFT JOIN file_storage ON room.room_picture = file_storage.file_id
        WHERE users_in_room.room_id IN (${getRooms}) AND users_in_room.user_id = (${userID})::integer GROUP BY room.room_id, file_storage.file_src
        ORDER BY max(room_messages.date_sended) NULLS LAST;
      `);
      if (!roomInfo?.length) return null;

      //* this query is unnecessary large & complex, but it justs gets the last X messages of every room by counting the times the room_id was repeated
      //* in the future, this will become a problem. It's just better to do two queries.
      const messageInfo: Array<roomInfo> = await this.dataSource.query(`
          SELECT * FROM (SELECT room_messages.sender_id, room_messages.which_room, room_messages.date_sended, messages.message_content, messages.file_id, messages.message_id
            FROM 
              (SELECT ROW_NUMBER() OVER (PARTITION BY which_room),*
              FROM room_messages) room_messages
            LEFT JOIN messages ON room_messages.message_id = messages.message_id
            LEFT JOIN users ON room_messages.sender_id = users.user_id  
            WHERE 
              room_messages.which_room  IN (${roomInfo.map((roomID) => `'${roomID.room_id}'::varchar`)}) 
            ORDER BY date_sended DESC limit ${MAX_MESSAGES_PER_REQ}) subquery ORDER BY subquery.date_sended ASC;`);

      const userInfo: Array<userInfo & { current_user: boolean }> = await this
        .dataSource.query(`
	        SELECT DISTINCT(users.user_id), users.user_name, file_storage.file_src AS profile_picture
	          FROM users
	          LEFT JOIN file_storage ON users.profile_picture = file_storage.file_id
	          LEFT JOIN room_messages ON users.user_id = room_messages.sender_id 
	          WHERE room_messages.which_room IN (${roomInfo.map((roomID) => `'${roomID.room_id}'::varchar`)}) AND users.user_id != ${userID}::integer
        `);

      const room = roomInfo.map((room: room) => {
        const messagesRoom =
          messageInfo.flatMap((msg) =>
            msg.which_room == room.room_id ? msg : [],
          ) || [];

        return { roomInfo: room, messages: messagesRoom ?? [] };
      });

      return {
        roomInfo: room,
        userInfo,
      };
    } catch {
      return null;
    }
  }
}
