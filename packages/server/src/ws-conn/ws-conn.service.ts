import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { room } from 'src/entities';
import { DataSource } from 'typeorm';

@Injectable()
export class WsConnService {
  // this.dataSource.manager.insert(users, {user_id: 1}) - example
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}
}
