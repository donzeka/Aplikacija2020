import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Auction } from "./auction.entity";
import { Product } from "./product.entity";
import * as Validator from 'class-validator';

@Index("uq_user_username", ["username"], { unique: true })
@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column({
    type: 'varchar',
    unique: true,
    length: 50,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsEmail({
    allow_ip_domain: false,
    allow_utf8_local_part: true,
    require_tld: true,
  })
  email: string;

  @Column("varchar", {
    unique: true,
    length: 50,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(4,32)
  username: string;

  @Column("varchar", {
    name: "password_hash",
    length: 128,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsHash('sha512')
  passwordHash: string;

  @Column("varchar", { length: 50, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2,128)
  name: string;

  @Column("varchar", { length: 50, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(2,128)
  surname: string;

  @Column("varchar", { length: 50, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsPhoneNumber(null)
  number: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => Auction, (auction) => auction.user)
  auctions: Auction[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
