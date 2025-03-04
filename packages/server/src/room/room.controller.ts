import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoomHistoryDto } from './dto/roomHistory.dto';
import { WsConnService } from 'src/ws-conn/ws-conn.service';
import { Request as RequestType } from 'express';
import { UsersRoomsService } from 'src/users-rooms/users-rooms.service';
@Controller('room')
@UseGuards(JWTAuthGuard)
export class RoomController {
  constructor(
    private roomService: RoomService,
    private usersRoomsService: UsersRoomsService,
    private wsConn: WsConnService,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async createRoom(
    @Body(new ValidationPipe()) body: RoomDto,
    @Request() req: RequestType,
  ) {
    const roomCreated = (await this.roomService.CreateRoom(body)).raw;
    //! i think it's impossible to reach this scope but if anything happens, this error would save my life
    if (!roomCreated)
      throw new HttpException(
        'Couldnt join room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    console.log({ roomCreated });
    await this.usersRoomsService.JoinRoomONCreation(
      roomCreated[0]?.room_id,
      req?.user,
    );
    return roomCreated;
  }

  @Get('roomhistory')
  async getRoomHistory(
    @Request() req: RequestType,
    @Body(new ValidationPipe()) body: RoomHistoryDto,
  ) {
    return this.wsConn.RoomHistory(req.user, body);
  }

  @Get('allRooms')
  async getAllRooms(@Request() req: RequestType) {
    const rooms = await this.wsConn.GetRoomsOfUser(req.user.id);
    return await this.wsConn.GetRoomMessages(req.user.id, rooms);
  }
}
