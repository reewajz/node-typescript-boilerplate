import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import * as mysqlDriver from 'mysql';
dotenv.config();

export function getDbConfig(): DataSourceOptions {
  const sync = process.env.DB_SYNCHRONIZATION || true;
  return {
    driver: mysqlDriver,
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    synchronize: sync,
    logging: false,
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    entities: [__dirname + '/../entities/*.{ts,js}'],
  } as DataSourceOptions;
}
