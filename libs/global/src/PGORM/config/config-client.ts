import { PoolConfig } from 'pg';
import {
  PG_SSL_CRT,
  PG_SSL_ENABLED,
  PG_SSL_KEY,
  POSTGRES_CONNECTION_STRING,
} from '../../utils/environments';

const ssl = {
  rejectUnauthorized: false,
  key: PG_SSL_KEY,
  cert: PG_SSL_CRT,
};

export const configClient: PoolConfig = {
  connectionString: POSTGRES_CONNECTION_STRING,
  ssl: JSON.parse(PG_SSL_ENABLED!) ? ssl : false,
  idle_in_transaction_session_timeout: 10000,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
};
