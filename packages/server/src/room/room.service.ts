import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { file_storage, room } from 'src/entities';
import { FindOneOptions, Repository } from 'typeorm';
import { RoomDto } from './dto/room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils/hashingFuncs';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(room)
    private roomRepository: Repository<room>,
    @InjectRepository(file_storage)
    private fileStorage: Repository<file_storage>,
  ) {}

  async FindOne(where: FindOneOptions<room>['where']): Promise<room> {
    const roomExisting = await this.roomRepository.findOne({
      where: where,
      relations: {
        room_picture: true,
      },
      select: {
        room_picture: {
          file_id: false,
          file_name: false,
          file_src: true,
        },
      },
    });
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
      return await this.roomRepository
        .createQueryBuilder()
        .insert()
        .into(room)
        .values({
          room_name,
          room_password: pwd,
        })
        .returning('room_id,room_name,room_description,created_at,room_picture')
        .execute();
    } catch (error) {
      if ('constraint' in error && error.constraint === 'room_pkey') {
        const getCount: Array<{ actual_count: string }> =
          await this.roomRepository.query(
            `SELECT lpad(nextval('ROOMID_ONERROR')::varchar, 6, '0') AS actual_count;`,
          );
        return await this.roomRepository
          .createQueryBuilder()
          .insert()
          .into(room)
          .values({
            room_id: getCount.at(0).actual_count,
            room_name,
            room_password: pwd,
          })
          .returning(
            'room_id,room_name,room_description,created_at,room_picture',
          )
          .execute();
      }
      throw new HttpException(
        'Something went wrong while creating the room.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadRoomPhoto(roomID: room['room_id'], file: Express.Multer.File) {
    if (roomID == undefined) return;
    try {
      const roomPhoto = await this.fileStorage.insert({
        file_name: file?.originalname,
        file_src: file?.filename,
      });

      const photo = await this.roomRepository.update(
        { room_id: roomID },
        {
          room_picture: roomPhoto.raw[0].file_id,
        },
      );
      return photo;
    } catch {
      return null;
    }
  }
}
