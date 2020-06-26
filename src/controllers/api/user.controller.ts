import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { User } from "entities/user.entity";
import { UserService } from "src/services/user/user.service";

@Controller('api/user')
@Crud({
    model: {
        type: User
    },
    params: {
        id: {
            field: 'userId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            
        }
    }
})
export class UserControler {
    constructor(public service: UserService) {}
}