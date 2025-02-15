import { Module } from '@nestjs/common';
import { UsersRoomsService } from './users-rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { room_messages } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([room_messages])],
  providers: [UsersRoomsService],
  exports: [UsersRoomsService],
})
export class UsersRoomsModule {}
