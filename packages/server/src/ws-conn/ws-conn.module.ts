import { forwardRef, Module } from '@nestjs/common';
import { WsConnGateway } from './ws-conn.gateway';
import { WsConnController } from './ws-conn.controller';
import { WsConnService } from './ws-conn.service';
import { RoomModule } from 'src/room/room.module';
import { LoginModule } from 'src/login/login.module';
import { AuthModule } from 'src/auth/auth.module';
import { RoomMessagesModule } from 'src/room-messages/room-messages.module';
import { UsersRoomsModule } from 'src/users-rooms/users-rooms.module';

@Module({
  providers: [WsConnGateway, WsConnService],
  imports: [
    LoginModule,
    forwardRef(() => RoomModule),
    AuthModule,
    RoomMessagesModule,
    UsersRoomsModule,
  ],
  controllers: [WsConnController],
  exports: [WsConnService],
})
export class WsConnModule {}
