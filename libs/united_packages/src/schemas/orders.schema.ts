import { ORM } from '@libs/global';
import { UNITED_PACKAGES_TABLES } from '../models/united_packages.models';

export const ORDERS_SCHEMA = ORM.createSchema(
  UNITED_PACKAGES_TABLES.ORDERS,
  {
    customer: ORM.uuid(),
    weight: ORM.numeric(),
    created_at: ORM.bigint().default(Date.now().toString()),
    delivery_date: ORM.bigint(),
    allocated_at: ORM.bigint().isNullable(),
    destination: ORM.uuid(),
    target: ORM.uuid(),
    status: ORM.enum(['ממתינה לציוות', 'נשלחה', 'הושלמה', 'בוטלה']),
    event_id: ORM.uuid().isNullable(),
    ship_id: ORM.uuid().isNullable(),
  },
  false,
);
