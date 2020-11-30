export class JwtRefreshDataDto{
    role: "administrator" | "user";
    id: number;
    username: string;
    exp: number; //unix timestamp
    ip: string;
    ua: string; //user agent

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    toPlainObject(){
        return {
            role: this.role,
            id: this.id,
            username: this.username,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua
        };
    }
}