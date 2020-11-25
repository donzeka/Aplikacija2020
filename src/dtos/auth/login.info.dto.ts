export class LoginInfoDto {
    id: number;
    username: string;
    token: string;

    constructor(id: number, un: string, jwt: string){
        this.username = un;
        this.id = id;
        this.token = jwt;
    }
}