import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ROLES } from '@chat-app/utils/globalConstants';
import {
  messages,
  room,
  room_messages,
  users,
  users_in_room,
} from 'src/entities';
import { JWT_DECODED_INFO } from 'src/utils/types';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomMessagesService {
  constructor(
    @InjectRepository(room_messages)
    private roomMsgsRepo: Repository<room_messages>,
  ) {}

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

  async InsertMessageInRoom(
    messageID: messages['message_id'],
    userID: users['user_id'],
    roomID: room['room_id'],
  ) {
    try {
      return await this.roomMsgsRepo
        .createQueryBuilder()
        .insert()
        .into(room_messages)
        .values({
          which_room: roomID,
          message_id: messageID,
          sender_id: userID,
        })
        .returning('*')
        .execute();
    } catch {
      throw new InternalServerErrorException('Something went wrong.');
    }
  }
}
