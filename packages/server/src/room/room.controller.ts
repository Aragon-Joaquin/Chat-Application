import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoomHistoryDto } from './dto/roomHistory.dto';
import { WsConnService } from 'src/ws-conn/ws-conn.service';
import { Request as RequestType } from 'express';
import { UserService } from 'src/user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoomService } from './room.service';
import { room } from 'src/entities';

@Controller('room')
@UseGuards(JWTAuthGuard)
export class RoomController {
  constructor(
    private wsConn: WsConnService,
    private userService: UserService,
    private roomService: RoomService,
  ) {}

  // createRoom method is useless here since the user needs to join the room in the socket as well

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

    if (!rooms?.length) return [];
    const [allRooms, currentUser] = await Promise.all([
      this.wsConn.GetRoomMessages(req.user.id, rooms),
      this.userService.getUser(req.user.id),
    ]);

    return {
      ...allRooms,
      currentUser,
    };
  }

  @Post('uploadPhoto')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() body: { roomID: room['room_id'] },
  ) {
    await this.roomService.uploadRoomPhoto(body?.roomID, file);
    return file?.filename;
  }
}
