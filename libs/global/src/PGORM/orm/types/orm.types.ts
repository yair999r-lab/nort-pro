import { Column } from '../models/Column';
import { ORM } from '../models/ORM';

export type SqlValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[]
  | boolean[];

export interface ColumnConfig {
  sqlType: string;
  notNull: boolean;
  primaryKey: boolean;
  unique: boolean;
  constraintName?: string;
  defaultValue?: string;
  ref?: { table: string; column: string };
  enum?: string[];
}

export type ColumnRecord = Record<string, Column<SqlValue>>;

export interface ColumnRef<T extends SqlValue = SqlValue> {
  table: string;
  column: string;
  _type?: T; // phantom type
}

type ColType<C> = C extends Column<infer T> ? T : never;

type ColumnRefs<TCols extends ColumnRecord> = {
  [K in keyof TCols]: ColumnRef<ColType<TCols[K]>>;
};

type SchemaRows<T> =
  T extends ORM<string, infer C> ? Prettify<InferRow<C>> : never;

export type SchemaType<TName extends string, TCols extends ColumnRecord> = ORM<
  TName,
  TCols
> &
  ColumnRefs<TCols> & {
    _Row: SchemaRows<ORM<string, TCols>>;
  };

// queries types
export type InferRow<TCols extends ColumnRecord> = {
  [K in keyof TCols]: TCols[K] extends Column<infer T> ? T : never;
};

export type WhereOptions<TCols extends ColumnRecord> = Partial<InferRow<TCols>>;

export type FindOptions<
  TCols extends ColumnRecord,
  TKeys extends keyof TCols,
> = {
  select?: TKeys[];
  where?: WhereOptions<TCols>;
};

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

// migration types
export type MigrationMode = 'safe' | 'force';

export interface MigrationOptions {
  migrationMode: MigrationMode;
}

export type DbTable = Record<string, ColumnConfig>;

export interface SafeAction {
  description: string;
  sql: string;
}
export interface UnsafeAction {
  description: string;
  manualSql?: string;
}
export interface CompareResult {
  safe: SafeAction[];
  unsafe: UnsafeAction[];
}

export interface ColumnRow {
  column_name: string;
  data_type: string;
  enum_type: string | null;
  character_maximum_length: number | null;
  is_nullable: 'YES' | 'NO';
  column_default: string | null;
}

export interface ConstraintRow {
  constraint_name: string;
  constraint_type: 'PRIMARY KEY' | 'UNIQUE' | 'FOREIGN KEY';
  column_name: string;
  foreign_schema: string | null;
  foreign_table: string | null;
  foreign_column: string | null;
}

export interface TriggerRow {
  trigger_name: string | null;
  event_manipulation: string;
  action_timing: string;
  event_object_table: string;
  tgtype: number;
}

interface CompareContext {
  tableFullName: string;
  tableName: string;
  columnName: string;
  column: ColumnConfig;
  dbColumn: ColumnConfig;
}

export type ColumnCompare = (ctx: CompareContext) => CompareResult;

export interface BaseColumnsInterface {
  id: string;
  created_at: number;
  update_at: number;
  created_by: string | null;
  update_by: string | null;
  is_deleted: boolean;
}

export type TriggerTiming = 'BEFORE' | 'AFTER' | 'INSTEAD OF';
export type TriggerEvent = 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';
export type TriggerEventCombo =
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE'
  | 'TRUNCATE'
  | 'INSERT OR UPDATE'
  | 'INSERT OR DELETE'
  | 'UPDATE OR DELETE'
  | 'INSERT OR UPDATE OR DELETE';

export type TriggerLevel = 'ROW' | ' STATEMENT';

type TriggerCbType = {
  query: string;
  name: string;
};

export interface TriggerInterface {
  name: string;
  cb: TriggerCbType;
  tableName?: string;
  event?: TriggerEvent | TriggerEventCombo;
  timing?: TriggerTiming;
  level?: TriggerLevel;
  when?: string;
}

export interface SchemaTriggerInfo {
  trigger_name: string;
  trigger_function_name: string;
  trigger_function_schema: string;
  table_name: string;
  event_manipulation: string;
  action_timing: string;
  trigger_level: string;
}

export interface CompositeUniqueConstraint {
  name: string;
  columns: string[];
}

export interface JunctionJoinEntry<T extends string = string> {
  name: T; // FK column name in the junction table - inferred as literal for type-safe returns
  ref: ColumnRef; // { table, column } - the referenced PK (table is fully-qualified schema.table)
}

/** Generic constraints for all createJunctionTable()-related types */
export type JunctionArrayConstraint = readonly {
  name: string;
  ref: ColumnRef;
}[];
export type JunctionAdditionalConstraint = Record<string, Column<SqlValue>>;

type JunctionFKColumns<TJoin extends readonly JunctionJoinEntry[]> = {
  [T in TJoin[number] as T['name']]: Column<SqlValue>;
};

export type JunctionColumnNames<
  TJoin extends readonly JunctionJoinEntry[],
  TAdditional extends JunctionAdditionalConstraint,
> = keyof (JunctionFKColumns<TJoin> & TAdditional) & string;

export type JunctionColumnRecord<
  TJoin extends readonly JunctionJoinEntry[],
  TAdditional extends
    JunctionAdditionalConstraint = JunctionAdditionalConstraint,
> = JunctionFKColumns<TJoin> & TAdditional;

/** Options object passed to ORM.createJunctionTable() */
export type JunctionTableOptions<
  TJoin extends JunctionArrayConstraint,
  TAdditional extends JunctionAdditionalConstraint,
> = {
  join: TJoin;
  name?: string;
  schema?: string;
  isBaseColumns?: boolean;
  additionalColumns?: TAdditional;
};

/**
 * Tuple type for the `uniqueFields` parameter of ORM.createJunctionTable() - at least 2 column names.
 * Enforces a minimum of 2 elements via the tuple shape.
 */
export type JunctionTableUniqueFields<
  TJoin extends JunctionArrayConstraint,
  TAdditional extends JunctionAdditionalConstraint,
> = [
  JunctionColumnNames<TJoin, TAdditional>,
  JunctionColumnNames<TJoin, TAdditional>,
  ...JunctionColumnNames<TJoin, TAdditional>[],
];

/** Return type of ORM.createJunctionTable() */
export type CreateJunctionReturnType<
  TJoin extends JunctionArrayConstraint,
  TAdditional extends
    JunctionAdditionalConstraint = JunctionAdditionalConstraint,
> = ORM<string, JunctionColumnRecord<TJoin, TAdditional>> | void;

export interface CompositeConstraintRow {
  constraint_name: string;
  column_name: string;
  ordinal_position: number;
}
