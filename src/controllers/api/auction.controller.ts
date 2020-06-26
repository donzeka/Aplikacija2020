import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Auction } from "entities/auction.entity";
import { AuctionService } from "src/services/auction/auction.service";

@Controller('api/auction')
@Crud({
    model: {
        type: Auction
    },
    params: {
        id: {
            field: 'auctionId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            
        }
    }
})
export class AuctionControler {
    constructor(public service: AuctionService) {}
}