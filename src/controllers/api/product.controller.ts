import { Controller, Post, Body } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { ProductService } from "src/services/product/product.service";
import { Product } from "entities/product.entity";
import { AddProductDto } from "src/dtos/product/add.product.dto";
import { ApiResponse } from "src/misc/api.response.class";

@Controller('api/product')
@Crud({
    model: {
        type: Product
    },
    params: {
        id: {
            field: 'productId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            category: {
                eager: true
            },
            images: {
                eager: true
            },
            productPrices: {
                eager: true
            },
            user: {
                eager: true
            },
            auctions: {
                eager: true
            }
        }
    }
})
export class ProductControler {
    constructor(public service: ProductService) {}

    @Post('createFull')
    createFullProduct(@Body() data: AddProductDto): Promise<Product | ApiResponse>{
        return this.service.createFullProduct(data);
    }
}