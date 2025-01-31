import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { EnvDBInfo } from './utils/getEnvVariables';

@Module({
  imports: [
    LoginModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: EnvDBInfo.DB_PORT,
      username: EnvDBInfo.DB_USERNAME,
      password: EnvDBInfo.DB_PASSWORD,
      database: EnvDBInfo.DB_NAME,
      synchronize: EnvDBInfo.IS_PRODUCTION,
      autoLoadEntities: true,
      entities: ['./entities/*.ts'],
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
