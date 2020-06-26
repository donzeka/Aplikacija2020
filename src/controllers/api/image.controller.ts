import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { ImageService } from "src/services/image/image.service";

@Controller('api/image')
@Crud({
    model: {
        type: Image
    },
    params: {
        id: {
            field: 'imageId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            product: {
                eager: true
            }
        }
    }
})
export class ImageControler {
    constructor(public service: ImageService) {}
}