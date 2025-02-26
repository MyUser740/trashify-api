import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlacesEntity } from './places.entity';
import { ProductEntity } from './product.entity';

@Entity('account')
export class AccountEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    NIK: string;

    @Column()
    FullName: string;

    @Column()
    Email: string;

    @Column()
    Password: string;


    @OneToMany(() => PlacesEntity, (place) => place.account)
    places: PlacesEntity[];

    @OneToMany(() => ProductEntity, (product) => product.account)
    products: ProductEntity[];
}