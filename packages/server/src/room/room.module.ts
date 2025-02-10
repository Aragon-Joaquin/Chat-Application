import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { room } from 'src/entities';
import { RoomController } from './room.controller';
import { LoginService } from 'src/login/login.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([room])],
  providers: [RoomService, LoginService, AuthService],
  exports: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
