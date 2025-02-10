import { IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';
import { REQUEST_DB_OPTIONS } from 'src/utils/types';

export class RoomHistoryDto implements REQUEST_DB_OPTIONS {
  @IsString()
  @MaxLength(6)
  roomName: string;

  @IsNumber()
  @IsPositive()
  limit?: number;

  @IsNumber()
  @IsPositive()
  offset?: number;
}
