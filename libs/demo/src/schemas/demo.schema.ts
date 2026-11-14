import { ORM } from '@libs/global';
import { DEMO_TABLES } from '../models/demo.tables';

export const DEMO_SCHEMA = ORM.createSchema(
  DEMO_TABLES.DEMO,
  {
    name: ORM.varchar(255),
  },
);
