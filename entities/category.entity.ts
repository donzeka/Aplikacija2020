import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn({ name: 'category_id', type: 'int', unsigned: true })
    categoryId: number;

    @Column({ name: 'cat_name', type: 'varchar', length: '128', unique: true})
    catName: string;

    @Column({name: 'image_path', type: 'varchar', length: '128'})
    imagePath: string;
}