import { Module } from '@nestjs/common';
import { RoomMessagesService } from './room-messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { room_messages } from 'src/entities';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([room_messages])],
  providers: [RoomMessagesService, AuthService],
  exports: [RoomMessagesService],
})
export class RoomMessagesModule {}
