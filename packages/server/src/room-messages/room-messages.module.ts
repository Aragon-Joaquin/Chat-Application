import { Module } from '@nestjs/common';
import { RoomMessagesService } from './room-messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { room_messages } from 'src/entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([room_messages]), AuthModule],
  providers: [RoomMessagesService],
  exports: [RoomMessagesService],
})
export class RoomMessagesModule {}
