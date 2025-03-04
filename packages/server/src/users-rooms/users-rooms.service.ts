import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { room, room_messages, users_in_room } from 'src/entities';
import { typesOfRoles } from 'src/utils/constants';
import { comparePassword } from 'src/utils/hashingFuncs';
import { JWT_DECODED_INFO } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRoomsService {
  constructor(
    @InjectRepository(users_in_room)
    private usersRoomsService: Repository<users_in_room>,
  ) {}

  async GetUsersRooms(user: JWT_DECODED_INFO['id']) {
    console.log({ user });
    return await this.usersRoomsService.findBy({
      user_id: user,
    });
  }

  async GetUsersOneRoom(user: JWT_DECODED_INFO['id'], room: room['room_id']) {
    const oneRoom = await this.usersRoomsService.findOneBy({
      user_id: user,
      room_id: room,
    });
    if (!oneRoom)
      throw new BadRequestException('User does not belong to that room.');
    return oneRoom;
  }

  async VerifyAndJoinRoom(
    room: room,
    user: JWT_DECODED_INFO,
    password?: string,
  ) {
    if (
      !comparePassword({
        userPassword: password,
        originalPassword: room.room_password,
      }) &&
      room.room_password != ''
    )
      throw new BadRequestException("Passwords don't match.");

    return await this.usersRoomsService.insert({
      room_id: room.room_id,
      user_id: user.id,
      role_id: { role_name: typesOfRoles.USER },
    });
  }

  async JoinRoomONCreation(roomID: room['room_id'], user: JWT_DECODED_INFO) {
    return await this.usersRoomsService.insert({
      room_id: roomID,
      user_id: user.id,
      role_id: { role_name: typesOfRoles.OWNER },
    });
  }

  async DeleteFromRoom(user: users_in_room) {
    try {
      return await this.usersRoomsService.delete({
        user_id: user.user_id,
        room_id: user.room_id,
      });
    } catch (e) {
      throw new InternalServerErrorException("Couldn't delete user from room");
    }
  }
}
