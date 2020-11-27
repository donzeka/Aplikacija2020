import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.entity";
import * as Validator from 'class-validator';

@Index("fk_product_price_product_id", ["productId"], {})
@Entity("product_price")
export class ProductPrice {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "product_price_id",
    unsigned: true,
  })
  productPriceId: number;

  @Column("int", { name: "product_id", unsigned: true })
  productId: number;

  @Column("decimal", { unsigned: true, precision: 10, scale: 2 })
  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  price: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.productPrices, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "productId" }])
  product: Product;
}
