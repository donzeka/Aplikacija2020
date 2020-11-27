import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.entity";
import * as Validator from 'class-validator';

@Index("uq_category_cat_name", ["catName"], { unique: true })
@Index("uq_category_image_path", ["imagePath"], { unique: true })
@Entity("category")
export class Category {
  @PrimaryGeneratedColumn({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column("varchar", {
    name: "cat_name",
    unique: true,
    length: 128,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5,32)
  catName: string;

  @Column("varchar", { name: "image_path", unique: true, length: 128 })
  
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1,255)
  imagePath: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
