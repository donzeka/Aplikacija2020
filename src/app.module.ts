import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'config/database.config';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { Auction } from 'entities/auction.entity';
import { Category } from 'entities/category.entity';
import { Product } from 'entities/product.entity';
import { ProductPrice } from 'entities/productPrice.entity';
import { User } from 'entities/user.entity';
import { Image } from 'entities/image.entity';
import { AdministratorController } from './controllers/api/administrator.controller';
import { CategoryControler } from './controllers/api/category.controller';
import { CategoryService } from './services/category/category.service';
import { ProductService } from './services/product/product.service';
import { ProductControler } from './controllers/api/product.controller';
import { AuctionService } from './services/auction/auction.service';
import { ImageService } from './services/image/image.service';
import { ProductPriceService } from './services/productPrice/productPrice.service';
import { UserService } from './services/user/user.service';
import { AuctionControler } from './controllers/api/auction.controller';
import { ImageControler } from './controllers/api/image.controller';
import { ProductPriceControler } from './controllers/api/productPrice.controller';
import { UserControler } from './controllers/api/user.controller';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      host: DatabaseConfig.hostname,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      database: DatabaseConfig.database,
      entities: [ 
        Administrator,
        User,
        Auction,
        Category,
        Product,
        ProductPrice,
        Image
      ]
    }),
    TypeOrmModule.forFeature([
        Administrator,
        User,
        Auction,
        Category,
        Product,
        ProductPrice,
        Image
    ])
  ],
  controllers: [
    AppController,

    AdministratorController,
    UserControler,
    AuctionControler,
    CategoryControler,
    ProductControler,
    ProductPriceControler,
    ImageControler
  ],
  providers: [
    AdministratorService,
    UserService,
    AuctionService,
    CategoryService,
    ProductService,
    ProductPriceService,
    ImageService
  ],
})
export class AppModule {}
