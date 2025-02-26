import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity('entity')
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    thumbnail: string;

    @ManyToOne(() => AccountEntity, (account) => account.products)
    @JoinColumn()
    account: AccountEntity;
}