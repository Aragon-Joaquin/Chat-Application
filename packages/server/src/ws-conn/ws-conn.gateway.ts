import { Inject, Logger } from '@nestjs/common';
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

@WebSocketGateway(WS_PORT, {
  namespace: WS_NAMESPACE,
  transports: ['websocket'],
})
export class WsConnGateway {
  @WebSocketServer() wss: Server;

  constructor(
    @InjectDataSource()
    private dbRepositories: DataSource,
  ) {}

  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage(WS_ACTIONS.SEND)
  handleMessage(client: Socket, payload: messageWSShape): string {
    this.dbRepositories.manager.transaction();
    return 'Hello world!';
  }

  @SubscribeMessage(WS_ACTIONS.JOIN)
  handleJoinRoom(client: Socket, roomID: string) {}
}
