import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ROLES } from '@chat-app/utils/globalConstants';
import {
  messages,
  room,
  room_messages,
  users,
  users_in_room,
} from 'src/entities';
import { RoomHistoryDto } from 'src/room/dto/roomHistory.dto';
import { JWT_DECODED_INFO } from 'src/utils/types';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomMessagesService {
  constructor(
    @InjectRepository(room_messages)
    private roomMsgsRepo: Repository<room_messages>,
  ) {}

  async InnerJoinRoomMessages(body?: RoomHistoryDto) {
    const history = await this.roomMsgsRepo
      .createQueryBuilder('msgs')
      .innerJoinAndSelect('msgs.message_id', 'messages')
      .innerJoinAndSelect('msgs.sender_id', 'sender')
      .limit(body?.limit ?? 50)
      .offset(body?.offset ?? 0)
      .getManyAndCount();

    return history;
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
    const messageExists = await this.roomMsgsRepo.findOneBy({
      which_room: roomID,
      ...(messageID && { message_id: messageID }),
      ...(userID && { sender_id: userID }),
    });

    if (!messageExists) throw new UnauthorizedException();
    return messageExists;
  }

  async DeleteMessageInRoom(userExists: users_in_room, message: room_messages) {
    if (
      userExists.role_id.role_name === ROLES.user &&
      userExists.user_id !== message.sender_id
    )
      throw new UnauthorizedException(
        "You don't have the permissions to do that.",
      );

    await this.roomMsgsRepo.delete({
      message_id: message.message_id,
    });

    return message;
  }

  async GetRoomMessages(userInRooms: users_in_room[], limit?: number) {
    if (!userInRooms) return null;

    // i need to match the userInRooms.room_id === room_messages.which_room
    // then order by DESC the room_messages.date_sended
    // to finally get the last room_messages.message_id and query it with a ton of more rooms

    //! i have no rooms yet, so... testing more later on
    return await this.roomMsgsRepo
      .createQueryBuilder('room_msgs')
      .where('room_msgs.which_room IN(:room_id)', {
        room_id: [...userInRooms.map((room) => room.room_id)],
      })
      .getManyAndCount();
  }
}
