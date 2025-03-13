import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MAXIMUM_ROOMS_PER_USER } from '@chat-app/utils/globalConstants';
import { messages, room, users, users_in_room } from 'src/entities';
import { RoomMessagesService } from 'src/room-messages/room-messages.service';
import { RoomHistoryDto } from 'src/room/dto/roomHistory.dto';
import { RoomService } from 'src/room/room.service';
import { UsersRoomsService } from 'src/users-rooms/users-rooms.service';
import { JWT_DECODED_INFO } from 'src/utils/types';
import { DataSource, InsertResult } from 'typeorm';
import { MAX_MESSAGES_PER_REQ } from 'src/utils/constants';
import { WsException } from '@nestjs/websockets';

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

  async CreateMessageToRoom(
    messageProps: Pick<messages, 'message_content' | 'file_id'>,
    roomID: room['room_id'],
    userID: users['user_id'],
  ) {
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

      console.log(roomMessage.raw[0]);

      return {
        message_content: messageCreated.raw[0]?.message_content,
        file_id: messageCreated.raw[0]?.file_id,
        message_id: messageCreated.raw[0]?.message_id,
        date_sended: roomMessage.raw[0]?.date_sended,
      };
    } catch {
      return;
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
          (SELECT ROW_NUMBER() OVER (PARTITION BY which_room ORDER BY date_sended desc),*
          FROM room_messages) room_messages
	      LEFT JOIN messages ON room_messages.message_id = messages.message_id
        LEFT JOIN users ON room_messages.sender_id = users.user_id 
        WHERE room_messages.row_number <= ${MAX_MESSAGES_PER_REQ} AND room_messages.which_room 
        IN (${roomInfo.map((roomID) => `'${roomID.room_id}'::varchar`)});`);

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
