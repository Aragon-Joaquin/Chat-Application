import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvDBInfo } from './utils/getEnvVariables';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    LoginModule,
    AuthModule,
    PassportModule,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
