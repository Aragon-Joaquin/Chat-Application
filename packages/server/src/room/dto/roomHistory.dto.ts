import { MAX_MESSAGES_PER_REQ } from '@chat-app/utils/globalConstants';
import { IsNumber, IsPositive, IsString, Min } from 'class-validator';
import { REQUEST_DB_OPTIONS } from 'src/utils/types';

export class RoomHistoryDto implements REQUEST_DB_OPTIONS {
  @IsString()
  room_id: string;

  @IsNumber()
  @IsPositive()
  @Min(MAX_MESSAGES_PER_REQ)
  offset: number;
}
