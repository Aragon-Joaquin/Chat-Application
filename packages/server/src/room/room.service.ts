import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { room } from 'src/entities';
import { FindOneOptions, Repository } from 'typeorm';
import { RoomDto } from './dto/room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils/hashingFuncs';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(room)
    private roomRepository: Repository<room>,
  ) {}

  async FindOne(where: FindOneOptions<room>): Promise<room> {
    const roomExisting = this.roomRepository.findOne(where);

    if (!roomExisting)
      throw new HttpException('Room does not exist', HttpStatus.BAD_REQUEST);

    return roomExisting;
  }

  //! the idea was using the ON CONFLICT DO UPDATE SET
  //! but it keep updating the another key with the same ID instead of creating a new one
  async CreateRoom(body: RoomDto) {
    const { room_name, room_password } = body;
    const pwd = room_password ? await hashPassword(room_password) : '';
    try {
      return await this.roomRepository.insert({
        room_name,
        room_password: pwd,
      });
    } catch (error) {
      // yes, i need to maintain the state
      if ('constraint' in error && error.constraint === 'room_pkey') {
        const getCount: Array<{ actual_count: string }> =
          await this.roomRepository.query(
            `SELECT lpad(nextval('ROOMID_ONERROR')::varchar, 6, '0') AS actual_count;`,
          );
        return await this.roomRepository.insert({
          room_id: getCount.at(0).actual_count,
          room_name,
          room_password: pwd,
        });
      }
      throw new HttpException(
        'Something went wrong while creating the room.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
