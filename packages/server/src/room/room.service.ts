import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { room } from 'src/entities';
import { FindOneOptions, InsertResult, Repository } from 'typeorm';
import { RoomDto } from './dto/room.dto';

//! this is the worst monolith i've created yet
@Injectable()
export class RoomService {
  constructor(private roomRepository: Repository<room>) {}

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
}
