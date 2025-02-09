import { Logger, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WS_ACTIONS, WS_NAMESPACE, WS_PORT } from 'src/utils/constants';
import { messageWSShape } from './types.d';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WsConnGuard } from './ws-conn.guard';

@WebSocketGateway(WS_PORT, {
  namespace: WS_NAMESPACE,
  transports: ['websocket'],
})
@UseGuards(WsConnGuard)
export class WsConnGateway {
  @WebSocketServer() wss: Server;

  // this.dataSource.manager.insert(users, {user_id: 1}) - example
  // this.dataSource.createQueryRunner().manager.insert(users, {user_id: 1}) example 2
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  @SubscribeMessage(WS_ACTIONS.SEND)
  handleMessage(client: Socket, payload: messageWSShape): string {
    return 'Hello world!';
  }

  @SubscribeMessage(WS_ACTIONS.JOIN)
  handleJoinRoom(client: Socket, roomID: string) {}

  // @SubscribeMessage(WS_ACTIONS.LEAVE)

  // @SubscribeMessage(WS_ACTIONS.DELETE)
}
