import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Auction {
    @PrimaryGeneratedColumn({ name: 'auction_id', type: 'int', unsigned: true })
    auctionId: number;

    @Column({ name: 'auction_name', type: 'varchar', length: '128', unique: true})
    auctionName: string;

    @Column({type: 'enum', length: ''})
    status: string;

    @Column({type: 'datetime', length: ''})
    duration: Date;

    //user_id, product_id, created_at
}