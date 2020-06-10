import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Auction } from "./auction.entity";
import { Product } from "./product.entity";

@Index("uq_user_username", ["username"], { unique: true })
@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", {
    name: "username",
    unique: true,
    length: 50,
    default: () => "'0'",
  })
  username: string;

  @Column("varchar", {
    name: "password_hash",
    length: 128,
    default: () => "'0'",
  })
  passwordHash: string;

  @Column("varchar", { name: "name", length: 50, default: () => "'0'" })
  name: string;

  @Column("varchar", { name: "surname", length: 50, default: () => "'0'" })
  surname: string;

  @Column("varchar", { name: "number", length: 50, default: () => "'0'" })
  number: string;

  @Column("varchar", { name: "address", length: 50, default: () => "'0'" })
  address: string;

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
