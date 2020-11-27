import * as Validator from 'class-validator';

export class LoginUserDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(4,32)
    username: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6,128)
    password: string;
}