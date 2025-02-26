import path from 'path';
import { DataSourceOptions } from 'typeorm';
import entities from '../entities';

export const config: DataSourceOptions = {
    type: 'better-sqlite3',
    database: path.join(process.cwd(), 'db/data/db.sqlite'),
    synchronize: true,
    entities: entities
};