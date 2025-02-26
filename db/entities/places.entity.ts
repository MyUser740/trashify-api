import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('places')
export class PlacesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    description: string;

    @Column()
    type: 'residential' | 'commercial' | 'industrial' | 'laboratory';

    @Column()
    quota: number;

    @Column()
    current: number;

    @Column()
    fine: number;

    @Column()
    CO2: number;


    @ManyToOne(() => AccountEntity, (account) => account.places)
    @JoinColumn()
    account: AccountEntity;
}