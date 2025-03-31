import { forwardRef, Module } from '@nestjs/common';
import { WsConnGateway } from './ws-conn.gateway';
import { WsConnController } from './ws-conn.controller';
import { WsConnService } from './ws-conn.service';
import { RoomModule } from 'src/room/room.module';
import { LoginModule } from 'src/login/login.module';
import { RoomMessagesModule } from 'src/room-messages/room-messages.module';
import { UsersRoomsModule } from 'src/users-rooms/users-rooms.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [WsConnGateway, WsConnService],
  imports: [
    LoginModule,
    forwardRef(() => RoomModule),
    RoomMessagesModule,
    UsersRoomsModule,
    AuthModule,
    UserModule,
  ],
  controllers: [WsConnController],
  exports: [WsConnService],
})
export class WsConnModule {}
