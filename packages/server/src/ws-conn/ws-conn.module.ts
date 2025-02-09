import { Module } from '@nestjs/common';
import { WsConnGateway } from './ws-conn.gateway';
import { LoginModule } from 'src/login/login.module';

@Module({
  providers: [WsConnGateway],
  imports: [LoginModule],
})
export class WsConnModule {}
