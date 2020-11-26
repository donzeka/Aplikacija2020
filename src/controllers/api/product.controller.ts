import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, Req, Delete, Patch, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { ProductService } from "src/services/product/product.service";
import { Product } from "src/entities/product.entity";
import { AddProductDto } from "src/dtos/product/add.product.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageConfig } from "config/storage.config";
import { diskStorage } from "multer";
import { ImageService } from "src/services/image/image.service";
import { Image } from "src/entities/image.entity";
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { EditProductDto } from "src/dtos/product/edit.product.dto";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";

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
    },
    routes: {
        only: [
            'getOneBase',
            'getManyBase',
        ],
        getOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator', 'user')
            ],
        },
        getManyBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator', 'user')
            ],
        }
                      
    }
})
export class ProductControler {
    constructor(
        public service: ProductService,
        public imageService: ImageService,
        ) {}
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    @Post()
    createFullProduct(@Body() data: AddProductDto): Promise<Product | ApiResponse>{
        return this.service.createFullProduct(data);
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    @Patch(':id')
    editFullProduct(@Param('id') id: number, @Body() data: EditProductDto){
        return this.service.editFullProduct(id, data);
    }

    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    @Post(':id/uploadPhoto/')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.photo.destination,
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
                    req.fileFilterError = 'Bad file extension!';
                    callback(null, false);
                    return;
                }
                // 2. Check tipa sadrzaja: image/jpeg, image/png (mimetype)
                if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))){
                    req.fileFilterError = 'Bad file content!';
                    callback(null, false);
                    return;
                }

                callback(null, true);
            },
            limits: {
                files: 1,
                fileSize: StorageConfig.photo.maxSize,
            }
        })
    )
    
    async uploadPhoto(
        @Param('id') articleId: number, 
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        @UploadedFile() photo,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        @Req() req
    ): Promise<ApiResponse | Image> {
        if (req.fileFilterError) {
            return new ApiResponse('error', -4002, req.fileFilterError);
        }

        if (!photo) {
            return new ApiResponse('error', -4002, 'File not uploaded!');
        }
        
        const fileTypeResult = await fileType.fromFile(photo.path);
        if (!fileTypeResult){
            fs.unlinkSync(photo.path);
            return new ApiResponse('error', -4002, 'Cannot detect file type!');
        }
        
        const realMimeType = fileTypeResult.mime;
        if (!(realMimeType.includes('jpeg') || realMimeType.includes('png'))){
            fs.unlinkSync(photo.path);
            return new ApiResponse('error', -4002, 'Bad file content type!');
        }

        await this.createResizedImage(photo, StorageConfig.photo.resize.thumb);
        await this.createResizedImage(photo, StorageConfig.photo.resize.small);

        const newImage: Image = new Image();
        newImage.productId = articleId;
        newImage.imagePath = photo.filename;

        const savedImage = await this.imageService.add(newImage);
        if (!savedImage) {
            return new ApiResponse('error', -4001);
        }

        return savedImage;
    }
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        async createResizedImage(photo, resizeSettings) {
            const originalFilePath = photo.path;
            const fileName = photo.filename;

            const destinationFilePath = StorageConfig.photo.destination
                                    + resizeSettings.directory
                                    + fileName;

            await sharp(originalFilePath)
                .resize({
                    fit: 'cover',
                    width: resizeSettings.width,
                    height: resizeSettings.height,
                })
                .toFile(destinationFilePath);
        } 
        
        @UseGuards(RoleCheckerGuard)
        @AllowToRoles('administrator')
        @Delete(':productId/deletePhoto/:photoId')
        public async deletePhoto(
            @Param('productId') productId: number,
            @Param('photoId') photoId: number,
        ) {
            const photo = await this.imageService.findOne({
                productId: productId,
                imageId: photoId
            });

            if(!photo) {
                return new ApiResponse('error', -4004, 'Photo not found!');
            }

            try{
            fs.unlinkSync(StorageConfig.photo.destination + photo.imagePath);
            fs.unlinkSync(StorageConfig.photo.destination + StorageConfig.photo.resize.thumb.directory + photo.imagePath);
            fs.unlinkSync(StorageConfig.photo.destination + StorageConfig.photo.resize.small.directory + photo.imagePath);
            } catch (e) {}

            const deleteResult = await this.imageService.deleteById(photoId);

            if(deleteResult.affected == 0) {
                return new ApiResponse('error', -4004, 'Photo not found!');
            }
            
            return new ApiResponse('ok', -0, 'One photo deleted');
        }
        
}