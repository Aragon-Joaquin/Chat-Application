import { IsOptional, IsString, MaxLength } from 'class-validator';
import { TextMinMaxDecorator } from 'src/decorators';
import { ROOM_CODE_TYPE, UUID_TYPE } from 'src/utils/types';

export interface RoomInformation {
  room_name: string;
  room_password?: string;
  room_description?: string;
}

export interface RoomInDB extends RoomInformation {
  room_id: ROOM_CODE_TYPE;
  created_At: Date;
  room_picture: UUID_TYPE;
}

export class RoomDto implements RoomInformation {
  @TextMinMaxDecorator(1, 20)
  room_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  room_description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  room_password?: string;
}
