import * as Validator from 'class-validator';

export class EditProductDto{
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(5,128)
    productName: string;

    categoryId: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(10,10000)
    description: string;

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
    })
    price: number;
}