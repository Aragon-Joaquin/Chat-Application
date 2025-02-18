import {
  Body,
  Controller,
  forwardRef,
  Get,
  Headers,
  Inject,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoomHistoryDto } from './dto/roomHistory.dto';
import { WsConnService } from 'src/ws-conn/ws-conn.service';

@Controller('room')
@UseGuards(JWTAuthGuard)
export class RoomController {
  constructor(
    private roomService: RoomService,
    private wsConn: WsConnService,
  ) {}

  @Post()
  async createRoom(
    @Body(new ValidationPipe()) body: RoomDto,
    // @Headers('Authorization') auth: string,
  ) {
    return await this.roomService.CreateRoom(body);
  }

  @Get('roomhistory')
  async getRoomHistory(
    @Headers('Authorization') auth: string,
    @Body(new ValidationPipe()) body: RoomHistoryDto,
  ) {
    return this.wsConn.RoomHistory(auth, body);
  }

  // @Get('allRooms')
  // async getAllRooms(@Headers('Authorization') auth: string) {
  //   return this.wsConn.GetAllRoomMessages(auth);
  // }
}
