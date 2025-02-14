import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ROLES } from 'globalConstants';
import { AuthService } from 'src/auth/auth.service';
import { messages, room, room_messages, users_in_room } from 'src/entities';
import { LoginService } from 'src/login/login.service';
import { RoomHistoryDto } from 'src/room/dto/roomHistory.dto';
import { RoomService } from 'src/room/room.service';
import { comparePassword } from 'src/utils/hashingFuncs';
import { JWT_DECODED_INFO } from 'src/utils/types';
import { DataSource } from 'typeorm';

@Injectable()
export class WsConnService {
  constructor(
    private roomService: RoomService,
    private loginService: LoginService,
    private authService: AuthService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async GetRoomsOfUser(user: JWT_DECODED_INFO['id']) {
    return await this.dataSource.manager.findBy(users_in_room, {
      user_id: user,
    });
  }

  async JoinRoom(id: string, password: string, userInfo: JWT_DECODED_INFO) {
    const [roomExisting, user] = await Promise.all([
      this.roomService.FindOne({ where: { room_id: id } }),
      this.loginService.findOne({
        where: { user_name: userInfo.userName, user_id: userInfo.id },
      }),
    ]);

    if (
      !comparePassword({
        userPassword: password,
        originalPassword: roomExisting.room_password,
      })
    )
      throw new BadRequestException("Passwords don't match.");

    return await this.dataSource.manager.insert(users_in_room, {
      room_id: roomExisting.room_id,
      user_id: user.user_id,
      role_name: 'user',
    });
  }

  async LeaveRoom(user: JWT_DECODED_INFO['id'], roomID: string) {
    const userExists = await this.FindUserInRoom(user, roomID);
    await this.dataSource.manager.delete(users_in_room, {
      user_id: userExists.user_id,
      room_id: userExists.room_id,
    });
  }

  async RoomHistory(token: string, body: RoomHistoryDto) {
    const user = this.authService.DecodeJWT(token);
    const room = await this.roomService.FindOne({
      where: { room_id: body.roomName },
    });

    const [history, _] = await Promise.all([
      this.dataSource
        .getRepository(room_messages)
        .createQueryBuilder('msgs')
        .innerJoinAndSelect('msgs.message_id', 'messages')
        .innerJoinAndSelect('msgs.sender_id', 'sender')
        .limit(body?.limit ?? 50)
        .offset(body?.offset ?? 0)
        .getManyAndCount(),
      this.FindUserInRoom(user['id'], room['room_id']),
    ]);

    return history;
  }

  async GetAllRoomMessages(token: string, limit?: number) {
    const JWT_INFO = this.authService.DecodeJWT(token);
    const userInRooms = await this.GetRoomsOfUser(JWT_INFO.id);
    if (!userInRooms) return null;

    // i need to match the userInRooms.room_id === room_messages.which_room
    // then order by DESC the room_messages.date_sended
    // to finally get the last room_messages.message_id and query it with a ton of more rooms

    return; //! finish this
  }

  async FindUserInRoom(
    userID: JWT_DECODED_INFO['id'],
    roomID: room['room_id'],
  ) {
    const userExists = await this.dataSource.manager.findOneBy(users_in_room, {
      user_id: userID,
      room_id: roomID,
    });

    if (!userExists) throw new UnauthorizedException();
    return userExists;
  }

  async FindMessageInRoom({
    roomID,
    messageID,
    userID,
  }: {
    roomID: room['room_id'];
    messageID?: messages['message_id'];
    userID?: JWT_DECODED_INFO['id'];
  }) {
    const messageExists = await this.dataSource.manager.findOneBy(
      room_messages,
      {
        which_room: roomID,
        ...(messageID && { message_id: messageID }),
        ...(userID && { sender_id: userID }),
      },
    );

    if (!messageExists) throw new UnauthorizedException();
    return messageExists;
  }

  async DeleteMessageInRoom(
    userID: JWT_DECODED_INFO['id'],
    roomID: room['room_id'],
    messageID: messages['message_id'],
  ) {
    const [userExists, message] = await Promise.all([
      this.FindUserInRoom(userID, roomID),
      this.FindMessageInRoom({ messageID, roomID }),
    ]);

    if (
      userExists.role_name === ROLES.user &&
      userExists.user_id !== message.sender_id
    )
      throw new UnauthorizedException(
        "You don't have the permissions to do that.",
      );

    await this.dataSource.manager.delete(room_messages, {
      message_id: message.message_id,
    });

    return message;
  }
}
