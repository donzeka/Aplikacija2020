import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn({ name: 'product_id', type: 'int', unsigned: true })
    productId: number;

    @Column({ name: 'product_name', type: 'varchar', length: '128'})
    productName: string;

    @Column({ type: 'text', length: '65535'})
    description: string;

    //category_id, user_id, created_at
}