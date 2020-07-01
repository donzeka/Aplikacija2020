import { Controller, Post, Body, Param, UseInterceptors, UploadedFile } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { ProductService } from "src/services/product/product.service";
import { Product } from "entities/product.entity";
import { AddProductDto } from "src/dtos/product/add.product.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageConfig } from "config/storage.config";
import { diskStorage } from "multer";
import { ImageService } from "src/services/image/image.service";
import { Image } from "entities/image.entity";

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
    constructor(
        public service: ProductService,
        public imageService: ImageService,
        ) {}

    @Post('createFull')
    createFullProduct(@Body() data: AddProductDto): Promise<Product | ApiResponse>{
        return this.service.createFullProduct(data);
    }

    @Post(':id/uploadPhoto/')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.photoDestination,
                filename: (req, file, callback) => {
                    const original: string = file.originalname;

                    let normalized = original.replace(/\s+/g, '-');
                    normalized = normalized.replace(/[^A-z0-9\.\-]/g, '');
                    const sada = new Date();
                    let datePart = '';
                    datePart += sada.getFullYear().toString();
                    datePart += (sada.getMonth() + 1).toString();
                    datePart += sada.getDate().toString();

                    const randomPart: string =
                        new Array(10)
                            .fill(0)
                            .map(() => (Math.random() * 9).toFixed(0).toString())
                            .join('');

                    let fileName = datePart + '-' + randomPart + '-' + normalized;
                    fileName = fileName.toLocaleLowerCase();
                    callback(null, fileName);
                }
            }),
            fileFilter: (req, file, callback) => {
                // 1. Check ekstenzije: JPG, PNG
                if (!file.originalname.toLocaleLowerCase().match(/\.(jpg|png)$/)){
                    callback(new Error('Bad file extension!'), false);
                    return;
                }
                // 2. Check tipa sadrzaja: image/jpeg, image/png (mimetype)
                if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))){
                    callback(new Error('Bad file content!'), false);
                    return;
                }

                callback(null, true);
            },
            limits: {
                files: 1,
                fieldSize: StorageConfig.photoMaxFileSize,
            }
        })
    )
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async uploadPhoto(@Param('id') articleId: number, @UploadedFile() photo): Promise<ApiResponse | Image> {
        const newImage: Image = new Image();
        newImage.productId = articleId;
        newImage.imagePath = photo.filename;

        const savedImage = await this.imageService.add(newImage);
        if (!savedImage) {
            return new ApiResponse('error', -4001);
        }

        return savedImage;
    }
}