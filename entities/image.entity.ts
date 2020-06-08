import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Image {
    @PrimaryGeneratedColumn({ name: 'image_id', type: 'int', unsigned: true })
    imageId: number;

    @Column({ name: 'image_path', type: 'varchar', length: '128', unique: true})
    imagePath: string;

    //product_id
}