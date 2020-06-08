import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ProductPrice {
    @PrimaryGeneratedColumn({ name: 'product_price_id', type: 'int', unsigned: true })
    productPriceId: number;

    @Column({ type: 'number', length: '10'})
    price: number;

    //product_id, created_at
}