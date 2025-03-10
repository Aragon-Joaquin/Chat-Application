import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvDBInfo } from './utils/getEnvVariables';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { WsConnModule } from './ws-conn/ws-conn.module';
import { RoomModule } from './room/room.module';
import { RoomMessagesModule } from './room-messages/room-messages.module';
import { UsersRoomsModule } from './users-rooms/users-rooms.module';
import {
  file_storage,
  messages,
  roles,
  room,
  room_messages,
  users,
  users_in_room,
} from './entities';

@Module({
  imports: [
    LoginModule,
    AuthModule,
    PassportModule,
    WsConnModule,
    RoomModule,
    RoomMessagesModule,
    UsersRoomsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: EnvDBInfo.DB_PORT,
      username: EnvDBInfo.DB_USERNAME,
      password: EnvDBInfo.DB_PASSWORD,
      database: EnvDBInfo.DB_NAME,
      synchronize: EnvDBInfo.IS_PRODUCTION,
      autoLoadEntities: true,
      entities: [
        file_storage,
        messages,
        roles,
        room_messages,
        users_in_room,
        room,
        users,
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
