import path from 'path';
import { DataSourceOptions } from 'typeorm';
import entities from '../entities';

export const config: DataSourceOptions = {
    type: 'sqlite',
    database: process.env.NODE_ENV === 'production' ? process.env.DB_PATH : path.join(__dirname, '../data/db.sqlite'),
    synchronize: true,
    entities: entities
};