import { Module } from '@nestjs/common';
import { UsersRoomsService } from './users-rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { users_in_room } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([users_in_room])],
  providers: [UsersRoomsService],
  exports: [UsersRoomsService],
})
export class UsersRoomsModule {}
