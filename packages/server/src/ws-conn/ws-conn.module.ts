import { Module } from '@nestjs/common';
import { WsConnGateway } from './ws-conn.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [WsConnGateway],
  imports: [TypeOrmModule.forFeature()],
})
export class WsConnModule {}
