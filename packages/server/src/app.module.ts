import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { file_storage, users } from './entities';

process.loadEnvFile();

const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, IS_PRODUCTION } =
  process.env;
@Module({
  imports: [
    LoginModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: Number(DB_PORT) ?? 3306,
      username: DB_USERNAME ?? 'root',
      password: DB_PASSWORD ?? '',
      database: DB_NAME ?? '',
      synchronize: !(Boolean(IS_PRODUCTION) ?? false),
      autoLoadEntities: true,
      entities: [users, file_storage],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
