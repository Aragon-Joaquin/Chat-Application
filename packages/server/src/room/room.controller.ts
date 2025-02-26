import {
  Body,
  Controller,
  Get,
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

@Controller('room')
@UseGuards(JWTAuthGuard)
export class RoomController {
  constructor(
    private roomService: RoomService,
    private wsConn: WsConnService,
  ) {}

  @Post()
  async createRoom(@Body(new ValidationPipe()) body: RoomDto) {
    return await this.roomService.CreateRoom(body);
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
    console.log('auth from sv', req?.user);
    return await this.wsConn.GetAllRoomMessages(req.user.id);
  }
}
