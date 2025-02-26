import { DataSource } from 'typeorm';
import { config } from './config';

export const dataSource = new DataSource(config);

export const initializeDatabase = async () => {
    if (!dataSource.isInitialized) {
        await dataSource.initialize()
            .catch((error) => console.log(error));
    }
}