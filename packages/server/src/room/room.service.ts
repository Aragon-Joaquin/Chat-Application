import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { messages, room, room_messages, users_in_room } from 'src/entities';
import { comparePassword } from 'src/utils/hashingFuncs';
import { DataSource, FindOneOptions, InsertResult, Repository } from 'typeorm';
import { RoomDto } from './dto/room.dto';
import { LoginService } from 'src/login/login.service';
import { AuthService } from 'src/auth/auth.service';
import { RoomHistoryDto } from './dto/roomHistory.dto';
import { JWT_DECODED_INFO } from 'src/utils/types';
import { ROLES } from 'src/utils/constants';

@Injectable()
export class RoomService {
  constructor(
    private roomRepository: Repository<room>,
    private loginService: LoginService,
    private authService: AuthService,

    private dataSource: DataSource,
  ) {}

  async FindOne(where: FindOneOptions<room>): Promise<room> {
    const roomExisting = this.roomRepository.findOne(where);

    if (!roomExisting)
      throw new HttpException('Room does not exist', HttpStatus.BAD_REQUEST);

    return roomExisting;
  }

  async CreateRoom(body: RoomDto): Promise<InsertResult> {
    const { room_name, room_description, room_password } = body;
    const newRoom = await this.roomRepository
      .createQueryBuilder()
      .insert()
      .into(room)
      .values({ room_name, room_description, room_password })
      //i have no idea if this would work
      .orUpdate(
        [`SET roomID = lpad(nextval('ROOMID_ONERROR'), 6, '0')`],
        ['room_id'],
      )
      .execute();

    return newRoom;
  }

  async JoinRoom(id: string, password: string, userInfo: JWT_DECODED_INFO) {
    const [roomExisting, user] = await Promise.all([
      this.FindOne({ where: { room_id: id } }),
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
      throw new HttpException('Passwords dont match', HttpStatus.BAD_REQUEST);

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
    const [room, user] = await Promise.all([
      this.FindOne({ where: { room_id: body.roomName } }),
      this.authService.DecodeJWT(token),
    ]);

    if (!user) throw new UnauthorizedException('User is not in room');

    await this.FindUserInRoom(user['id'], room['room_id']);

    return await this.dataSource
      .getRepository(room_messages)
      .createQueryBuilder('msgs')
      .innerJoinAndSelect('msgs.message_id', 'messages')
      .innerJoinAndSelect('msgs.sender_id', 'sender')
      .limit(body?.limit ?? 50)
      .offset(body?.offset ?? 0)
      .getManyAndCount();
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
