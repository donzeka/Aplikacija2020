import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import { DatabaseConfig } from 'config/database.config';
import { Administrator } from 'entities/administrator';
import { AdministratorService } from './services/administrator/administrator.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfig.hostname,
      port: 3306,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      database: DatabaseConfig.database,
      entities: [ Administrator ]
    }),
    TypeOrmModule.forFeature([Administrator])
  ],
  controllers: [AppController],
  providers: [AdministratorService],
})
export class AppModule {}
