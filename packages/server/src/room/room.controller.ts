import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  async createRoom(@Body(new ValidationPipe()) body: RoomDto) {
    const roomName = await this.roomService.CreateRoom(body);
    return roomName;
  }
}
