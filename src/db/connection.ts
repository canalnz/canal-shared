import {Connection, createConnection} from 'typeorm';
import * as pg from 'pg';
import * as path from 'path';

export interface DatabaseConnectionOptions {
  host?: string;
  database?: string;
  username?: string;
  password: string;
  port?: number;
}

export async function createDbConnection({
  host = 'localhost',
  username = 'postgres',
  database = 'canal',
  password,
  port = 5432
}: DatabaseConnectionOptions): Promise<Connection> {
  // Fix timezone parser to always parse dates as UTC. All dates in DB should be stored as utc
  // See https://github.com/typeorm/typeorm/issues/2622#issuecomment-476416712
  // See https://github.com/brianc/node-postgres/issues/429#issuecomment-24870258
  pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (str: string) => new Date(`${str}+0000`));
  return await createConnection({
    type: 'postgres',
    extra: {
      // Production DB is pretty anemic so we don't want too many connections.
      // We have multiple replicas, so we don't need a ton
      max: 3
    },
    database,
    host,
    port,
    username,
    password,
    entities: [
      path.resolve(__dirname, './entities/**/*.js')
    ],
    synchronize: false, // Be careful with this. It drops stuff
    logging: ['error']
    // logging: true
  });
}
