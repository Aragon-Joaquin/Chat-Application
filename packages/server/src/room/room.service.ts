import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { room, room_messages, users_in_room } from 'src/entities';
import { comparePassword } from 'src/utils/hashingFuncs';
import { DataSource, FindOneOptions, InsertResult, Repository } from 'typeorm';
import { RoomDto } from './dto/room.dto';
import { UserInDB } from 'src/login/dto/user.dto';
import { LoginService } from 'src/login/login.service';
import { AuthService } from 'src/auth/auth.service';
import { RoomHistoryDto } from './dto/roomHistory.dto';

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

  async JoinRoom(
    id: string,
    password: string,
    userInfo: Pick<UserInDB, 'userName' | 'id'>,
  ) {
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

  async RoomHistory(token: string, body: RoomHistoryDto) {
    const [room, user] = await Promise.all([
      this.FindOne({ where: { room_id: body.roomName } }),
      this.authService.DecodeJWT(token),
    ]);

    if (!user) throw new UnauthorizedException('User is not in room');

    const userExists: boolean = !!(await this.dataSource.manager.findOne(
      users_in_room,
      { where: { user_id: user.id, room_id: room.room_id } },
    ));

    if (!userExists) throw new UnauthorizedException();
    return await this.dataSource
      .getRepository(room_messages)
      .createQueryBuilder('msgs')
      .innerJoinAndSelect('msgs.message_id', 'messages')
      .innerJoinAndSelect('msgs.sender_id', 'sender')
      .limit(body?.limit ?? 50)
      .offset(body?.offset ?? 0)
      .getManyAndCount();
  }
}
