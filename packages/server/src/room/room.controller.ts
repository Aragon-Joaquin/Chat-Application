import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoomHistoryDto } from './dto/roomHistory.dto';

@Controller('room')
@UseGuards(JWTAuthGuard)
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  async createRoom(@Body(new ValidationPipe()) body: RoomDto) {
    return await this.roomService.CreateRoom(body);
  }

  @Get('/roomhistory')
  async getRoomHistory(
    @Headers('Authorization') auth: string,
    @Body(new ValidationPipe()) body: RoomHistoryDto,
  ) {
    return this.roomService.RoomHistory(auth, body);
  }
}
