import 'reflect-metadata';
import * as repos from './repos';
import * as entities from './entities';
import * as connection from './connection';

export * from './entities';
export * from './repos';
export * from './connection';

export const db = {
  ...entities,
  ...repos,
  ...connection
};
