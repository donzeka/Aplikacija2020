import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import { DatabaseConfig } from 'config/database.config';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { Auction } from 'entities/auction.entity';
import { Category } from 'entities/category.entity';
import { Product } from 'entities/product.entity';
import { ProductPrice } from 'entities/productPrice.entity';
import { User } from 'entities/user.entity';
import { Image } from 'entities/image.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfig.hostname,
      port: 3306,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      database: DatabaseConfig.database,
      entities: [ 
        Administrator,
        Auction,
        Category,
        Image,
        Product,
        ProductPrice,
        User
      ]
    }),
    TypeOrmModule.forFeature([Administrator])
  ],
  controllers: [AppController],
  providers: [AdministratorService],
})
export class AppModule {}
