import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({ name: 'username_id', type: 'int', unsigned: true })
    usernameId: number;

    @Column({ type: 'varchar', length: '50', unique: true})
    username: string;

    @Column({name: 'password_hash', type: 'varchar', length: '128'})
    passwordHash: string;

    @Column({type: 'varchar', length: '50', })
    name: string;

    @Column({ type: 'varchar', length: '50'})
    surname: string;

    @Column({ type: 'varchar', length: '50'})
    number: string;

    @Column({ type: 'varchar', length: '50'})
    adress: string;

    //created_at
}