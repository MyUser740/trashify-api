import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('article')
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    short_description: string;

    @Column()
    markdown: string;
}