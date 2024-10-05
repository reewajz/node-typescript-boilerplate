import { getDbConfig } from '@config/db.config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource(getDbConfig());
