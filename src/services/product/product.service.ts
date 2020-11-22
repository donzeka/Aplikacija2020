import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "src/entities/product.entity";
import { AddProductDto } from "src/dtos/product/add.product.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { Image } from "src/entities/image.entity";
import { EditProductDto } from "src/dtos/product/edit.product.dto";
import { ProductPrice } from "src/entities/productPrice.entity";
//import { ProductPriceService } from "../productPrice/productPrice.service";


@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
    constructor( 
        @InjectRepository(Product) 
        private readonly product: Repository<Product>,

        @InjectRepository(Image)
        private readonly image: Repository<Image>,

         @InjectRepository(ProductPrice)        //proveriti posto se cena vezuje za aukciju, ne za proizvod
         private readonly productPrice: Repository<ProductPrice>
    ) {
        super(product);
    }
    
    async createFullProduct(data: AddProductDto): Promise<Product | ApiResponse>{
        const newProduct: Product = new Product();
        newProduct.productName = data.productName;
        newProduct.categoryId = data.categoryId;
        newProduct.userId = data.userId;
        newProduct.description = data.description;

        const savedProduct = await this.product.save(newProduct);

        const newProductPrice: ProductPrice = new ProductPrice();
        newProductPrice.productId = savedProduct.productId;
        newProductPrice.price = data.price;

        await this.productPrice.save(newProductPrice);

        const newImage = new Image();   //jos proveriti, tabela, objekat ili sta vec
        newImage.productId = savedProduct.productId;
        //newImage.imagePath = data.images;

        return await this.product.findOne(savedProduct.productId, {
            relations: [
                "category",
                "images",
                "productPrices"
            ]
        });
    }

    async editFullProduct(productId: number, data: EditProductDto): Promise<Product | ApiResponse> {
        const existingProduct: Product = await this.product.findOne(productId, {
            relations: ['productPrices']
        });

        if(!existingProduct) {
            return new ApiResponse('error', -5001, 'Product not found.');
        }

        existingProduct.productName = data.productName;
        existingProduct.categoryId  = data.categoryId;
        existingProduct.description = data.description;

        const savedProduct = await this.product.save(existingProduct);
        if(!savedProduct) {
            return new ApiResponse('error', -5002, 'Could not save new product data.');
        }

        const newPriceString: string = Number(data.price).toFixed(2);
        const lastPrice = existingProduct.productPrices[existingProduct.productPrices.length-1].price
        const lastPriceString: string = Number(lastPrice).toFixed(2);

        if(newPriceString !== lastPriceString) {
            const newProductPrice = new ProductPrice();
            newProductPrice.productId = productId;
            newProductPrice.price = data.price;

            const savedProductPrice = await this.productPrice.save(newProductPrice);
            if(!savedProductPrice){
                return new ApiResponse('error', -5003, 'Could not save new product price.');
            }
        }

        return await this.product.findOne(savedProduct.productId, {
            relations: [
                "category",
                "images",
                "productPrices"
            ]
        });
    }
}

