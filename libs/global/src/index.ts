import { configClient } from './PGORM/config/config-client';
import { ORM } from './PGORM/orm/models/ORM';

export * from './PGORM/orm/models/Column';
export * from './PGORM/orm/models/ORM';
export * from './PGORM/orm/helpers/migration.functions';
export * from './PGORM/orm/helpers/migration.sql';
export * from './PGORM/orm/helpers/orm.helpers';
export * from './PGORM/orm/helpers/orm.sql';
export * from './PGORM/orm/types/orm.types';

export * from './middlewares/pino';
export * from './middlewares/cors';
export * from './middlewares/sql-injection/sqlInjection';
export * from './middlewares/helmet';
export * from './middlewares/handleServerError';

// auth
export * from './middlewares/auth/auth';

// Logger
export * from './helpers/logger/pino';
export * from './helpers/logger/time.helpers';

// Errors
export * from './helpers/errors/handleError';

// PG
export * from './helpers/pg/connectToPostgres';
export * from './helpers/pg/queryToPostgres';

// JWT
export * from './helpers/jwt/jwt.helpers';
export * from './helpers/jwt/token.schema';

// Validate
export * from './helpers/validate/validateFunction';

export * from './types/auth/auth.types';
export * from './types/logger/logger.types';

// Enviroments
export * from './utils/environments';

// Regex
export * from './utils/regex';

ORM.connect(configClient).catch((err) => {
  global.log.error({ tag: 'pgorm' }, `Failed to connect: ${err}`);
});
