import { HttpStatus } from '@nestjs/common';
import { room, users } from 'src/entities';

export const createErrorMessage = (
  name: string,
  code: HttpStatus,
  content?: any,
) =>
  JSON.stringify({
    error_name: name ?? '',
    error_code: code ?? HttpStatus.AMBIGUOUS,
    ...(content != null && { error_content: content }),
  });

export type userInfo = {
  user_id: number;
  user_name: string;
  profile_picture: string;
};

export type roomInfo = {
  sender_id: number;
  which_room: string;
  date_sended: Date;
  message_content: string;
  file_id: string | null;
  message_id: string;
};

export type MEDIA_PAYLOADS =
  | {
      action: 'roomPicture';
      roomPicture: {
        roomID: room['room_id'];
      };
    }
  | {
      action: 'userPicture';
    }
  | {
      action: 'chatIMG';
      chatIMG: {
        roomID: room['room_id'];
      };
    };
