export class LoginInfoDto {
    id: number;
    username: string;
    token: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;

    constructor(id: number, un: string, jwt: string, refreshToken: string, refreshTokenExpiresAt: string){
        this.username = un;
        this.id = id;
        this.token = jwt;
        this.refreshToken = refreshToken;
        this.refreshTokenExpiresAt = refreshTokenExpiresAt;
    }
}