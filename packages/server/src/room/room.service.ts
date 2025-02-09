import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { room, users_in_room } from 'src/entities';
import { comparePassword } from 'src/utils/hashingFuncs';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { RoomDto } from './dto/room.dto';
import { UserInDB } from 'src/login/dto/user.dto';
import { LoginService } from 'src/login/login.service';

@Injectable()
export class RoomService {
  constructor(
    private roomRepository: Repository<room>,
    private loginService: LoginService,
    private dataSource: DataSource,
  ) {}

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
      this.roomRepository.findOne({ where: { room_id: id } }),
      this.loginService.findOne({
        where: { user_name: userInfo.userName, user_id: userInfo.id },
      }),
    ]);

    if (!roomExisting)
      throw new HttpException('Room does not exist', HttpStatus.BAD_REQUEST);

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
}
