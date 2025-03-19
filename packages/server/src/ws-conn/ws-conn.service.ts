import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MAXIMUM_ROOMS_PER_USER } from '@chat-app/utils/globalConstants';
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
import { DataSource, InsertResult } from 'typeorm';
import { MAX_MESSAGES_PER_REQ } from 'src/utils/constants';
import { WsException } from '@nestjs/websockets';
import { RoomDto } from 'src/room/dto/room.dto';

@Injectable()
export class WsConnService {
  constructor(
    private roomService: RoomService,
    private roomMsgs: RoomMessagesService,
    private usersRoomsService: UsersRoomsService,
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

  //! rooms methods ⬇
  async JoinToNewRoom(
    id: string,
    userInfo: JWT_DECODED_INFO,
    password?: string,
  ) {
    const roomExisting = await this.roomService.FindOne({
      where: { room_id: id },
    });

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
    user: Partial<users>;
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

      const userProps = await this.getUserByMessageID(
        messageCreated.raw[0]?.message_id,
      );

      return {
        message: {
          message_content: messageCreated.raw[0]?.message_content,
          file_id: messageCreated.raw[0]?.file_id,
          message_id: messageCreated.raw[0]?.message_id,
        },
        user: {
          user_name: userProps?.user_name,
          profile_picture: userProps?.profile_picture,
          user_id: userProps?.user_id,
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
        SELECT DISTINCT ON (room.room_id) room.room_id, room.room_name, room.room_description, room.created_at, room.room_picture from room
        LEFT JOIN users_in_room ON room.room_id = users_in_room.room_id
        LEFT JOIN room_messages ON users_in_room.room_id = room_messages.which_room 
        WHERE users_in_room.room_id IN (${getRooms}) AND users_in_room.user_id = (${userID})::integer;
        `);
      if (!roomInfo?.length) return null;

      //* this query is unnecesary large & complex, but it justs gets the last 50 messages of every room by counting the times the room_id was repeated
      //* in the future, this will become a problem. It's just better to do two queries.
      const messageInfo: Array<{ which_room: string }> = await this.dataSource
        .query(`
        SELECT users.user_name, users.profile_picture, room_messages.which_room, room_messages.date_sended, 
        messages.message_content, messages.file_id, messages.message_id, case when room_messages.sender_id = ${userID}::integer then TRUE else FALSE end AS own_message
        FROM 
          (SELECT ROW_NUMBER() OVER (PARTITION BY which_room),*
          FROM room_messages) room_messages
	      LEFT JOIN messages ON room_messages.message_id = messages.message_id
        LEFT JOIN users ON room_messages.sender_id = users.user_id 
        WHERE room_messages.row_number <= ${MAX_MESSAGES_PER_REQ} AND room_messages.which_room 
        IN (${roomInfo.map((roomID) => `'${roomID.room_id}'::varchar`)}) ORDER BY date_sended ASC;`);

      const mergeResults = roomInfo.map((room: room) => {
        const messagesRoom =
          messageInfo?.flatMap((msg) =>
            msg.which_room == room.room_id ? msg : [],
          ) || [];
        return { roomInfo: room, messages: messagesRoom ?? [] };
      });

      return mergeResults;
    } catch {
      return null;
    }
  }
}
