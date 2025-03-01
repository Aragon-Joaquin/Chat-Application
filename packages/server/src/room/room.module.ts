import { forwardRef, Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { room } from 'src/entities';
import { RoomController } from './room.controller';
import { WsConnModule } from 'src/ws-conn/ws-conn.module';
import { UsersRoomsModule } from 'src/users-rooms/users-rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([room]),
    forwardRef(() => WsConnModule),
    UsersRoomsModule,
  ],
  providers: [RoomService],
  exports: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
