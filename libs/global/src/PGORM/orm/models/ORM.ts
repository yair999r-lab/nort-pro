import { CustomError } from '../../../helpers/errors/handleError';
import { Pool, PoolConfig, QueryResultRow } from 'pg';
import COMPARE_COLUMNS, {
  addNewColumn,
  normalizeDefault,
  normalizeType,
  parseTableName,
} from '../helpers/migration.functions';
import {
  COLUMNS_SQL,
  COMPOSITE_CONSTRAINTS_SQL,
  CONSTRAINTS_SQL,
} from '../helpers/migration.sql';
import {
  ColumnRecord,
  ColumnRef,
  ColumnRow,
  CompareResult,
  CompositeConstraintRow,
  CompositeUniqueConstraint,
  ConstraintRow,
  CreateJunctionReturnType,
  DbTable,
  FindOptions,
  InferRow,
  JunctionAdditionalConstraint,
  JunctionArrayConstraint,
  JunctionColumnRecord,
  JunctionTableOptions,
  JunctionTableUniqueFields,
  Prettify,
  SafeAction,
  SchemaType,
  SqlValue,
  TriggerInterface,
  // TriggerRow,
  UnsafeAction,
  WhereOptions,
} from '../types/orm.types';
import { Column } from './Column';
import { dropAllTriggersInTablesSql, fkTablesSql } from '../helpers/orm.sql';

export class ORM<TName extends string, TCols extends ColumnRecord> {
  static #pool: Pool | undefined;
  static #connectPromise: Promise<void> | undefined;
  static #schemas: Array<ORM<string, ColumnRecord>> = [];
  static #syncPromises: Map<string, Promise<void>> = new Map();

  #tableName: TName;
  #columns: TCols;
  #triggers: TriggerInterface[] = [];
  #compositeConstraints: CompositeUniqueConstraint[] = [];
  #tableLabel: string = 'Table';

  private constructor(tableName: TName, columns: TCols) {
    this.#tableName = tableName;
    this.#columns = columns;
  }

  static async connect(config: PoolConfig) {
    if (!ORM.#pool) {
      ORM.#pool = new Pool(config);
      ORM.#pool.on('error', (err) =>
        global.log.error({ tag: 'PG POOL' }, `DB not connected ${err.message}`),
      );
    }

    ORM.#connectPromise = ORM.#pool
      .connect()
      .then((client) => client.release());
    await ORM.#connectPromise;
  }

  /** Return the connect promise so deferred syncs can await it */
  static getConnectPromise() {
    return ORM.#connectPromise;
  }

  /** Return a column definition by name - used by createJunctionTable to read referenced PK types */
  getColumnModel<K extends keyof TCols & string>(
    key: K,
  ): Column<SqlValue> | undefined {
    return (this.#columns as Record<string, Column<SqlValue>>)[key];
  }

  /** Expose the registered table name for cross-schema lookups */
  public get tableName(): string {
    return this.#tableName;
  }

  /** Look up the SQL type of a referenced column by searching all registered schemas */
  static #resolveColumnType(ref: ColumnRef): string {
    for (const schema of ORM.#schemas) {
      if (schema.tableName !== ref.table) continue;
      const col = schema.getColumnModel(ref.column);
      if (col?.config.sqlType) return col.config.sqlType;
      throw new Error(
        `createJunctionTable: column "${String(ref.column)}" not found in table "${ref.table}"`,
      );
    }
    throw new Error(
      `createJunctionTable: could not resolve column type for "${ref.table}"."${String(
        ref.column,
      )}" - table not found in registered schemas`,
    );
  }

  static async #query<T extends QueryResultRow>(
    sql: string,
    values?: SqlValue[],
  ) {
    if (!ORM.#pool)
      throw new CustomError('DB not connected', 'CONNECT TO PG', 500);
    const { rows } = await ORM.#pool.query<T>(sql, values ?? []);
    return rows;
  }

  static uuid() {
    return new Column<string>('UUID');
  }
  static varchar(length?: number) {
    return length
      ? new Column<string>(`VARCHAR(${length})`)
      : new Column<string>(`VARCHAR`);
  }
  static double() {
    return new Column<number>('DOUBLE PRECISION');
  }
  static integer() {
    return new Column<number>('INTEGER');
  }
  static numeric(scale?: number) {
    return new Column<number>(scale ? `NUMERIC(${scale})` : `NUMERIC`);
  }
  static bigint() {
    return new Column<number>('BIGINT');
  }
  static boolean() {
    return new Column<boolean>('BOOLEAN');
  }
  static enum<T extends readonly string[]>(values: T): Column<T[number]> {
    if (values.length < 2)
      throw new Error('enum() requires at least two values!');
    return new Column<T[number]>('', { enum: [...values] });
  }

  static BASE_COLUMNS = {
    id: ORM.uuid().default('gen_random_uuid()').primaryKey(),
    created_at: ORM.bigint(),
    update_at: ORM.bigint(),
    created_by: ORM.varchar(),
    update_by: ORM.varchar(),
    is_deleted: ORM.boolean().default('FALSE'),
  };

  static async #readDbTable(schema: string, table: string): Promise<DbTable> {
    const columns = await ORM.#query<ColumnRow>(COLUMNS_SQL, [schema, table]); // הבאת כל העמודות של הטבלה במאגר המידע
    const constraints = await ORM.#query<ConstraintRow>(CONSTRAINTS_SQL, [
      schema,
      table,
    ]); // בדיקה והחזרת מערך התלויות של העמודות בטבלה

    const compositeRows = await ORM.#query<CompositeConstraintRow>(
      COMPOSITE_CONSTRAINTS_SQL,
      [schema, table],
    );
    const compositeConstraintNames = new Set(
      compositeRows.map((row) => row.constraint_name),
    );

    const dbTable: DbTable = {}; // יצירת אובייקט שמייצג את סכמת הטבלה כפי שהיא במאגר על מנת שנוכל להשוות אותה עם הסכמה בקוד

    columns.forEach(
      ({
        data_type,
        character_maximum_length,
        enum_type,
        is_nullable,
        column_default,
        column_name,
      }) => {
        dbTable[column_name] = {
          sqlType: normalizeType(
            data_type,
            character_maximum_length,
            enum_type,
          ),
          notNull: is_nullable === 'NO',
          defaultValue: column_default
            ? normalizeDefault(column_default)
            : undefined,
          primaryKey: false, // מתעדכן בהמשך לפי האילוצים Primary Key
          unique: false, // מתעדכן בהמשך לפי האילוצים Unique
        };
      },
    );

    // עדכון אילוצים (Primary Key, Unique, Foreign Key)
    if (constraints.length) {
      constraints.forEach(
        ({
          constraint_name,
          column_name,
          constraint_type,
          foreign_table,
          foreign_column,
          foreign_schema,
        }) => {
          const dbCol = dbTable[column_name];
          if (!dbCol) return;
          if (constraint_type === 'PRIMARY KEY') dbCol.primaryKey = true;
          if (
            constraint_type === 'UNIQUE' &&
            !compositeConstraintNames.has(constraint_name)
          ) {
            dbCol.unique = true;
            if (!dbCol.constraintName) dbCol.constraintName = constraint_name;
          }
          if (
            constraint_type === 'FOREIGN KEY' &&
            foreign_table &&
            foreign_column
          )
            dbCol.ref = {
              table: `${foreign_schema}.${foreign_table}`,
              column: foreign_column,
            };
        },
      );
    }

    return dbTable;
  }

  static #collectForeignKeySyncDependencies(
    columns: ColumnRecord,
  ): Promise<void>[] {
    const depPromises: Promise<void>[] = [];

    for (const column of Object.values(columns)) {
      const referencedTable = column.config.ref?.table;
      if (!referencedTable) continue;

      const targetSyncPromise = ORM.#syncPromises.get(referencedTable);
      if (targetSyncPromise) depPromises.push(targetSyncPromise);
    }

    return depPromises;
  }

  static #compareTableColumns(
    tableFullName: string,
    dbColumns: DbTable,
    newColumns: ColumnRecord,
  ): CompareResult {
    const { table } = parseTableName(tableFullName);

    const safe: SafeAction[] = [];
    const unsafe: UnsafeAction[] = []; // שינויים שמוחקים ו/או משנים מידע במאגר המידע

    // השוואת עמודות - מזהה עמודות חדשות ושינויים בעמודות קיימות והכנסתם למערכים של בטוח ולא בטוח
    Object.entries(newColumns).forEach(([columnName, column]) => {
      const dbColumn = dbColumns[columnName]; // מציאת העמודה כפי שמוגדרת בסכמה במאגר המידע

      // עמודה חדשה שלא קיימת במאגר
      if (!dbColumn) {
        const newColumnResult = addNewColumn(tableFullName, columnName, column);
        safe.push(...newColumnResult.safe);
        return;
      }

      // עמודה קיימת - בדיקת שינויים בכל פרמטר ואם הוא בטוח הכנסתו למערך הבטוחים אחרת למערך הלא בטוחים
      COMPARE_COLUMNS.forEach((check) => {
        const result = check({
          tableFullName,
          columnName,
          column: column.config,
          dbColumn,
          tableName: table,
        });
        safe.push(...result.safe);
        unsafe.push(...result.unsafe);
      });
      return;
    });

    // בדיקת עמודות שנמחקו מהסכמה בקוד אך עדיין קיימות במאגר
    Object.keys(dbColumns).forEach((name) => {
      if (!(name in newColumns))
        unsafe.push({
          description: `column "${name}" exists in DB but not in schema (data loss if dropped)`,
          manualSql: `ALTER TABLE ${tableFullName} DROP COLUMN "${name}";`,
        });
    });
    return { safe, unsafe };
  }

  static async #getIfTableExistsInDB(schema: string, table: string) {
    const result = await ORM.#query<{ exists: boolean }>(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = $1
        AND table_name = $2
      ) AS exists;`,
      [schema, table],
    );
    return result[0]?.exists ?? false;
  }

  // isBaseColumns = false -> ללא base columns
  static createSchema<TName extends string, TCols extends ColumnRecord>(
    tableName: TName,
    columns: TCols,
    isBaseColumns: false,
  ): SchemaType<TName, TCols>;

  // isBaseColumns = true (או חסר) -> עם base columns
  static createSchema<TName extends string, TCols extends ColumnRecord>(
    tableName: TName,
    columns: TCols,
    isBaseColumns?: true,
  ): SchemaType<TName, TCols & typeof ORM.BASE_COLUMNS>;

  // פונקציה יצירת טבלה מתוך סכמה
  static createSchema<TName extends string, TCols extends ColumnRecord>(
    tableName: TName,
    columns: TCols,
    isBaseColumns: boolean = true,
  ):
    | SchemaType<TName, TCols>
    | SchemaType<TName, TCols & typeof ORM.BASE_COLUMNS> {
    if (isBaseColumns) columns = { ...ORM.BASE_COLUMNS, ...columns };
    const schema = new ORM(tableName, columns) as
      | SchemaType<TName, TCols>
      | SchemaType<TName, TCols & typeof ORM.BASE_COLUMNS>;

    // יצירת טייפ מתוך הסכמה
    for (const column of Object.keys(columns)) {
      const ref: ColumnRef = { table: tableName, column };
      Object.defineProperty(schema, column, { value: ref, enumerable: false });
    }
    ORM.#schemas.push(schema);

    const { schema: schema_name, table } = parseTableName(tableName); // הוצאת שם הסכמה ושם הטבלה מתוך השם המלא של הטבלה

    // Ensure this table's sync waits for all FK-referenced tables to sync first.
    // This prevents "reference relation does not exist" errors when creating FK constraints.
    const depPromises = ORM.#collectForeignKeySyncDependencies(columns);

    const schemaInstance = schema;
    const tableLabel = schemaInstance.#tableLabel;
    const syncPromise: Promise<void> = Promise.all(depPromises).then(
      () =>
        new Promise<void>((resolve) =>
          setImmediate(async () => {
            try {
              await ORM.getConnectPromise();
              if (schema_name !== 'public')
                await ORM.#query(
                  `CREATE SCHEMA IF NOT EXISTS "${schema_name}"`,
                );
              await ORM.#syncEnums(schema_name, table, columns);
              const isNewTable = await ORM.#syncTable(
                tableName,
                schema_name,
                table,
                columns,
                schemaInstance.#compositeConstraints,
                tableLabel,
              );

              await ORM.#syncTriggers(schemaInstance); // Sync all triggers registered on this schema in a single batch
              if (!isNewTable)
                await ORM.#syncCompositeConstraints(schemaInstance); // Sync unique constraints only for existing tables
            } catch (error) {
              global.log.error(
                { tag: 'PGORM' },
                `Failed to sync "${tableName}": ${error}`,
              );
            }
            resolve();
          }),
        ),
    );
    ORM.#syncPromises.set(tableName, syncPromise);

    return schema;
  }

  static async #syncEnums(
    schemaName: string,
    tableName: string,
    columns: ColumnRecord,
  ): Promise<void> {
    for (const [columnName, col] of Object.entries(columns)) {
      const enumValues = col.config.enum;
      if (!enumValues) continue;

      const enumTypeName = `${tableName}_${columnName}`;
      const typeName = `"${schemaName}"."${enumTypeName}"`;

      // Resolve the column's sqlType to the bare enum type name (matches udt_name from information_schema)
      col.resolveSqlType(enumTypeName);

      const valueStr = enumValues
        .map((v) => `'${v.replace(/'/g, "''")}'`)
        .join(', ');

      // IF NOT EXISTS is not supported with schema-qualified names in PostgreSQL CREATE TYPE.
      // Use schema-qualified name without IF NOT EXISTS and ignore "already exists" errors.
      try {
        await ORM.#query(`CREATE TYPE ${typeName} AS ENUM (${valueStr})`);
      } catch (error) {
        const msg = (error as Error).message;
        if (msg.includes('already exists')) continue;
        throw error;
      }
    }
  }

  static async #syncTable(
    tableName: string,
    schema_name: string,
    table: string,
    columns: ColumnRecord,
    constraints: CompositeUniqueConstraint[],
    tableLabel: string = 'Table',
  ): Promise<boolean> {
    const isTableExists = await ORM.#getIfTableExistsInDB(schema_name, table);

    // אם הטבלה לא קיימת יוצרים אותה
    if (!isTableExists) {
      await ORM.#query(
        ORM.#createTableColumns(tableName, columns, constraints),
      );
      global.log.success(
        { tag: 'PGORM' },
        `Created ${tableLabel.toLowerCase()} "${tableName}"`,
      );
      return true;
    }

    // בדיקה האם משהו השתנה בטבלה
    const dbColumns = await ORM.#readDbTable(schema_name, table);
    for (const [columnName, column] of Object.entries(columns)) {
      if (
        column.config.unique &&
        !column.config.primaryKey &&
        !column.config.constraintName
      ) {
        column.resolveConstraintName(`${table}_${columnName}_key`);
      }
    }

    const { safe, unsafe } = ORM.#compareTableColumns(
      tableName,
      dbColumns,
      columns,
    );

    for (const action of safe)
      global.log.success(
        { tag: 'PGORM' },
        `${tableName}: ${action.description}`,
      );
    for (const action of unsafe) {
      const { description, manualSql } = action;
      const manual = manualSql ? `\n query: ${manualSql}` : '';
      global.log.error(
        { tag: 'PGORM' },
        `${tableName} needs to be changed manually \n description: ${description}${manual}`,
      );
    }

    for (const action of safe) {
      try {
        await ORM.#query(action.sql);
      } catch (error) {
        global.log.error(
          { tag: 'PGORM' },
          `Failed to execute safe migration on "${tableName}": ${action.sql} | Error: ${error}`,
        );
        throw error;
      }
    }

    if (safe.length === 0 && unsafe.length === 0)
      global.log.info(
        { tag: 'PGORM' },
        `${tableLabel} "${tableName}" is up to date`,
      );

    return false;
  }

  // ------------------------
  // TRIGGERS
  // ------------------------

  /** Drop every trigger and its associated function from the given table */
  static async #dropAllTriggersInTable(schemaName: string, tableName: string) {
    const triggers = await ORM.#query<{
      trigger_name: string;
      table_name: string;
      table_schema_name: string;
      trigger_function_name: string;
      function_schema_name: string;
    }>(dropAllTriggersInTablesSql, [schemaName, tableName]);

    for (const trigger of triggers) {
      const dropTriggerSql = `DROP TRIGGER IF EXISTS "${trigger.trigger_name}" ON "${trigger.table_schema_name}"."${trigger.table_name}"`;
      const dropFunctionSql = `DROP FUNCTION IF EXISTS "${trigger.function_schema_name}"."${trigger.trigger_function_name}"()`;

      await ORM.#query(dropTriggerSql);
      await ORM.#query(dropFunctionSql);
    }
    global.log.info(
      { tag: 'PGORM' },
      `Dropped all triggers in "${schemaName}.${tableName}" table!`,
    );
  }

  // יצירת פונקציית trigger ושאילתת CREATE TRIGGER אידמפוטנטית לטבלה הנוכחית
  createTrigger(trigger: TriggerInterface): this {
    trigger.tableName = this.#tableName;
    this.#triggers.push(trigger);
    return this;
  }

  // --------------
  // UNIQUE
  // --------------
  makeColumnsCombinationUnique(...columns: (keyof TCols & string)[]): this {
    // Validate: at least two columns
    if (columns.length < 2)
      throw new Error(
        'makeColumnsCombinationUnique: requires at least two columns',
      );

    // Validate: reject duplicate columns
    const seen = new Set<string>();
    for (const column of columns) {
      const key = String(column);
      if (seen.has(key))
        throw new Error(
          `makeColumnsCombinationUnique: duplicate column "${key}"`,
        );
      seen.add(key);
    }

    // Validate: reject columns that are already primary keys
    for (const column of columns) {
      if (this.#columns[column].config.primaryKey)
        throw new Error(
          `makeColumnsCombinationUnique: column "${String(column)}" is a PRIMARY KEY`,
        );
    }

    const { table } = parseTableName(this.#tableName);
    const fullName = `${table}_${columns.join('_')}_ukey`;
    const name = this.#truncateConstraintName(fullName);
    this.#compositeConstraints.push({ name, columns: columns });
    return this;
  }

  static createJunctionTable<
    TJoin extends JunctionArrayConstraint,
    TAdditional extends
      JunctionAdditionalConstraint = JunctionAdditionalConstraint,
  >(
    options: JunctionTableOptions<TJoin, TAdditional>,
    uniqueFields?: JunctionTableUniqueFields<TJoin, TAdditional>,
  ): CreateJunctionReturnType<TJoin, TAdditional> {
    const {
      join,
      name: customName,
      schema: customSchema,
      isBaseColumns = false,
      additionalColumns,
    } = options;

    // Step 1: Validate join array
    if (!Array.isArray(join) || join.length < 2)
      throw new Error(
        'createJunctionTable: "join" must be an array of at least 2 entries',
      );

    // Step 2: Determine schema prefix - use explicit `schema` option if provided, otherwise derive from first join entry
    const schemaPrefix =
      customSchema ?? parseTableName(join[0].ref.table).schema;

    // Validate: if explicit schema was provided, it must exist in registered schemas
    if (customSchema) {
      const schemaExists = ORM.#schemas.some(
        (schemaName) =>
          parseTableName(schemaName.tableName).schema === customSchema,
      );
      if (!schemaExists)
        throw new Error(
          `createJunctionTable: schema "${customSchema}" does not exist in registered schemas`,
        );
    }

    // Step 3: Auto-generate table name from referenced table names (without schema prefix).
    const tableNames = join.map(
      (entry) => parseTableName(entry.ref.table).table,
    );
    const baseName = customName ?? tableNames.join('_to_');
    const safeTableName = baseName.replace(/\./g, '_');
    const junctionTableName = `${schemaPrefix}.${safeTableName}`;

    // Step 4: Build FK columns from explicit join entries
    const fkColumns: Record<string, Column<SqlValue>> = {};
    const fkColumnNames: string[] = [];

    for (const entry of join) {
      const sqlType = ORM.#resolveColumnType(entry.ref);

      const fkColumn = new Column<SqlValue>(sqlType, { notNull: true }).ref({
        table: entry.ref.table,
        column: entry.ref.column,
      });
      fkColumns[entry.name] = fkColumn;
      fkColumnNames.push(entry.name);
    }

    // Step 5: Assemble full column record - type as JunctionColumnRecord so createSchema returns the right type
    const allColumns = {} as JunctionColumnRecord<TJoin, TAdditional>;
    if (isBaseColumns) Object.assign(allColumns, ORM.BASE_COLUMNS);
    Object.assign(allColumns, fkColumns);
    if (additionalColumns) Object.assign(allColumns, additionalColumns);

    // Step 6: Register the table via createSchema (pass false - base columns already inlined)
    const junctionSchema = ORM.createSchema(
      junctionTableName,
      allColumns,
      false,
    ) as ORM<string, JunctionColumnRecord<TJoin, TAdditional>>;
    junctionSchema.#tableLabel = 'Junction Table';

    // Step 7: Register composite UNIQUE constraint on all FK columns
    if (fkColumnNames.length >= 2)
      junctionSchema.makeColumnsCombinationUnique(...fkColumnNames);

    // Step 8: Register composite UNIQUE constraint from uniqueFields
    if (uniqueFields) {
      const allColumnNames = [
        ...fkColumnNames,
        ...(additionalColumns ? Object.keys(additionalColumns) : []),
      ];
      for (const field of uniqueFields) {
        if (!allColumnNames.includes(field))
          return global.log.error(
            { tag: 'PGORM' },
            `Junction Tables: "${field}" is not one of the junction ref field. \nThe table "${junctionTableName}" did not created!`,
          );
      }

      junctionSchema.makeColumnsCombinationUnique(...uniqueFields);
    }

    return junctionSchema;
  }

  /** Sync all triggers registered on a schema instance in a single batch */
  static async #syncTriggers(
    schemaInstance: ORM<string, ColumnRecord>,
  ): Promise<void> {
    const triggers = schemaInstance.#triggers;
    if (triggers.length === 0) return;

    const { schema, table } = parseTableName(schemaInstance.#tableName);

    // Drop all existing triggers on this table, then create all registered triggers
    await ORM.#dropAllTriggersInTable(schema, table);

    for (const trigger of triggers) {
      const { sqlTriggerFunction, sqlTrigger } =
        schemaInstance.#buildTrigger(trigger);
      await ORM.#query(sqlTriggerFunction);
      await ORM.#query(sqlTrigger);
      global.log.success(
        { tag: 'PGORM' },
        `Trigger "${trigger.name}" created on "${schemaInstance.#tableName}"`,
      );
    }
  }

  /** Sync all composite unique constraints registered on a schema instance */
  static async #syncCompositeConstraints(
    schemaInstance: ORM<string, ColumnRecord>,
  ): Promise<void> {
    const constraints = schemaInstance.#compositeConstraints;
    const { schema, table } = parseTableName(schemaInstance.#tableName);
    const tableFullName = `"${schema}"."${table}"`;

    // Query all UNIQUE constraints from the DB (including composite ones)
    const dbRows = await ORM.#query<CompositeConstraintRow>(
      COMPOSITE_CONSTRAINTS_SQL,
      [schema, table],
    );

    // Group DB constraint rows by constraint_name, preserving column order via ordinal_position
    const dbConstraintMap = new Map<string, Map<number, string>>();
    for (const row of dbRows) {
      if (!dbConstraintMap.has(row.constraint_name)) {
        dbConstraintMap.set(row.constraint_name, new Map());
      }
      dbConstraintMap
        .get(row.constraint_name)!
        .set(row.ordinal_position, row.column_name);
    }

    // Convert ordinal -> column maps into ordered arrays
    const dbConstraintColumns = new Map<string, string[]>();
    for (const [name, ordMap] of dbConstraintMap) {
      const sorted = Array.from(ordMap.entries()).sort(([a], [b]) => a - b);
      dbConstraintColumns.set(
        name,
        sorted.map(([, col]) => col),
      );
    }

    // Build a Set of constraint names expected by the schema
    const expectedNames = new Set(constraints.map((c) => c.name));

    // Drop DB constraints that are no longer defined in the schema
    for (const dbName of dbConstraintColumns.keys()) {
      if (!expectedNames.has(dbName)) {
        await ORM.#query(
          `ALTER TABLE ${tableFullName} DROP CONSTRAINT IF EXISTS "${dbName}"`,
        );
        global.log.success(
          { tag: 'PGORM' },
          `Composite unique constraint "${dbName}" dropped from "${schemaInstance.#tableName}"`,
        );
      }
    }

    // Create or recreate constraints defined in the schema
    for (const constraint of constraints) {
      const dbColumns = dbConstraintColumns.get(constraint.name);

      if (!dbColumns) {
        // Constraint doesn't exist - create it
        await schemaInstance.#applyConstraint(
          constraint,
          tableFullName,
          'created',
        );
      } else if (!schemaInstance.#columnsMatch(dbColumns, constraint.columns)) {
        // Constraint exists but columns differ - drop and recreate
        await ORM.#query(
          `ALTER TABLE ${tableFullName} DROP CONSTRAINT IF EXISTS "${constraint.name}"`,
        );
        await schemaInstance.#applyConstraint(
          constraint,
          tableFullName,
          'updated',
        );
      }
    }
  }

  async #deduplicateRows(
    constraint: CompositeUniqueConstraint,
    tableFullName: string,
  ) {
    const { schema: tableSchema, table: tableName } = parseTableName(
      this.#tableName,
    );

    // Step 1: Find all tables with FK references to this table's PK
    const fkTablesRaw = await ORM.#query(fkTablesSql, [tableSchema, tableName]);

    const fkTables = fkTablesRaw.map((row: Record<string, unknown>) => ({
      schema: row.table_schema as string,
      table: row.table_name as string,
      column: row.column_name as string,
      constraintName: row.constraint_name as string,
    }));

    // Step 2: Find the row to keep in each duplicate group (the one with the max id as text)
    const keptMatchConditions = constraint.columns
      .map((c) => `t."${c}" IS NOT DISTINCT FROM t2."${c}"`)
      .join(' AND ');
    const keptIdsSql = `
      SELECT MAX(t.id::text) AS id FROM ${tableFullName} t
      INNER JOIN ${tableFullName} t2
        ON ${keptMatchConditions}
      WHERE t.id::text < t2.id::text
      GROUP BY ${constraint.columns.map((c) => `t2."${c}"`).join(', ')}  
    `;
    const keptIdsRaw = await ORM.#query(keptIdsSql);
    const keptIds = keptIdsRaw.map((row: Record<string, unknown>) =>
      String(row.id),
    );

    // The rows to discard are all duplicates whose id is NOT the max in their group
    const discardMatchConditions = constraint.columns
      .map((c) => `t1."${c}" IS NOT DISTINCT FROM t2."${c}"`)
      .join(' AND ');
    const discardIdsSql = `
      SELECT t1.id FROM ${tableFullName} t1
      INNER JOIN ${tableFullName} t2
        ON ${discardMatchConditions}
      WHERE t1.id::text < t2.id::text
    `;
    const discardIdsRaw = await ORM.#query(discardIdsSql);
    const discardIds = discardIdsRaw.map((row: Record<string, unknown>) =>
      String(row.id),
    );

    if (discardIds.length === 0) return;

    // Step 3: For each FK table, reassign references from discarded rows to the kept row
    for (const fk of fkTables) {
      const fkTableFullName = `${fk.schema}.${fk.table}`;

      // Reassign FK references to the explicitly kept row (max id), not just any row with a higher id
      const colMatches = constraint.columns
        .map((c) => `discarded."${c}" IS NOT DISTINCT FROM kept."${c}"`)
        .join(' AND ');
      const updateSql = `
        UPDATE ${fkTableFullName}
        SET "${fk.column}" = kept.id
        FROM ${tableFullName} discarded
        INNER JOIN ${tableFullName} kept
          ON ${colMatches}
        WHERE ${fkTableFullName}."${fk.column}" = discarded.id
          AND discarded.id = ANY($1::text[])
          AND kept.id = ANY($2::text[])
      `;

      await ORM.#query(updateSql, [discardIds, keptIds]);
      global.log.warn(
        { tag: 'pgorm' },
        `Reassigned FK references in "${fkTableFullName}"."${fk.column}" from discarded duplicates to kept rows`,
      );
    }

    // Step 4: Delete the discarded rows
    const deleteSql = `DELETE FROM ${tableFullName} WHERE id = ANY($1::text[])`;
    await ORM.#query(deleteSql, [discardIds]);
    global.log.warn(
      { tag: 'PGORM' },
      `Duplicate rows removed from "${this.#tableName}" for constraint "${constraint.name}"`,
    );
  }

  #columnsMatch(dbColumns: string[], schemaColumns: string[]): boolean {
    if (dbColumns.length !== schemaColumns.length) return false;
    return dbColumns.every((col, i) => col === schemaColumns[i]);
  }

  /** Attempt to ADD a UNIQUE constraint, with automatic deduplication on conflict */
  async #applyConstraint(
    constraint: CompositeUniqueConstraint,
    tableFullName: string,
    actionLabel: string,
  ) {
    const columnList = constraint.columns.map((c) => `"${c}"`).join(', ');
    const sql = `ALTER TABLE ${tableFullName} ADD CONSTRAINT "${constraint.name}" UNIQUE (${columnList})`;
    try {
      await ORM.#query(sql);
      global.log.success(
        { tag: 'PGORM' },
        `Composite unique constraint "${constraint.name}" ${actionLabel} on "${this.#tableName}"`,
      );
    } catch (error) {
      const msg = String(error);
      if (
        msg.includes('could not create unique index') ||
        msg.includes('duplicate key')
      ) {
        try {
          await this.#deduplicateRows(constraint, tableFullName);
        } catch (dedupError) {
          global.log.error(
            { tag: 'PGORM' },
            `Deduplication failed for "${constraint.name}": ${String(dedupError)}`,
          );
          // After logging, fall through to retry the constraint - if no dups were found it may still succeed
        }
        await ORM.#query(sql);
        global.log.success(
          { tag: 'PGORM' },
          `Composite unique constraint "${constraint.name}" ${actionLabel} on "${this.#tableName}" after deduplication`,
        );
      } else {
        throw error;
      }
    }
  }

  /** Truncate a constraint name to 63 bytes (PostgreSQL NAMEDATALEN limit) appending a deterministic hash if needed */
  #truncateConstraintName(name: string): string {
    if (name.length <= 63) return name;
    const hash = name
      .split('')
      .reduce((a, c) => Math.imul(31, a) + c.charCodeAt(0), 0)
      .toString(36);
    return name.substring(0, 58) + '_' + hash;
  }

  #buildTrigger(trigger: TriggerInterface): {
    sqlTriggerFunction: string;
    dropSql: string;
    sqlTrigger: string;
  } {
    const { schema, table } = parseTableName(this.#tableName);
    const {
      name: triggerName,
      cb: { name: funcName, query },
      timing = 'AFTER',
      event = 'INSERT',
      level = 'ROW',
      when,
    } = trigger;

    // PostgreSQL requires TRUNCATE triggers to use FOR EACH STATEMENT (FOR EACH ROW is not supported)
    const isTruncate = event.toUpperCase().includes('TRUNCATE');
    const effectiveLevel = isTruncate ? 'STATEMENT' : level;

    // Split the trigger body into its DECLARE block and the rest of the statements
    const { declareBlock, statementBody } = this.#parseTriggerBody(query);

    const sqlTriggerFunction = this.#buildSqlTriggerFunction(
      schema,
      funcName,
      declareBlock,
      statementBody,
    );
    const dropSql = this.#buildDropTriggerSql(triggerName, schema, table);
    const sqlTrigger = this.#buildSqlTrigger(
      triggerName,
      schema,
      table,
      funcName,
      event,
      effectiveLevel,
      timing,
      when,
    );

    return { sqlTriggerFunction, dropSql, sqlTrigger };
  }

  // Split a PL/pgSQL trigger body into itd DECLARE block and statement body
  #parseTriggerBody(body: string): {
    declareBlock: string;
    statementBody: string;
  } {
    const trimmed = body.trimStart();
    if (!trimmed.startsWith('DECLARE'))
      return { declareBlock: '', statementBody: trimmed };

    // Try to find a BEGIN keyword - use it as the split point
    const beginMatch = /\n\s*BEGIN\s*/.exec(trimmed);
    if (beginMatch) {
      const declareSection = trimmed.slice(7, beginMatch.index).trim();
      const afterBegin = trimmed.slice(beginMatch.index + beginMatch[0].length);
      const declareBlock = declareSection ? `DECLARE\n ${declareSection}` : '';
      return { declareBlock, statementBody: afterBegin };
    }

    // No BEGIN keyword - extract DECLARE lines (ending with ;) until the statements start
    const afterDeclare = trimmed.slice(7);
    const lines = afterDeclare.split('\n');
    const declareLines: string[] = [];
    const statementLines: string[] = [];
    let inDeclare = true;

    for (const line of lines) {
      if (inDeclare && (line.trim() === '' || line.trim().endsWith(';'))) {
        declareLines.push(line);
      } else {
        inDeclare = false;
        statementLines.push(line);
      }
    }

    const declareBlock = declareLines.length
      ? `DECLARE\n ${declareLines.filter((l) => l.trim()).join('\n')}`
      : '';
    const statementBody = statementLines.join('\n').trimStart();

    return { declareBlock, statementBody: statementBody || trimmed };
  }

  // Generate CREATE OR REPLACE FUNCTION for the trigger callback
  #buildSqlTriggerFunction(
    schema: string,
    funcName: string,
    declareBlock: string,
    statementBody: string,
  ) {
    return `CREATE OR REPLACE FUNCTION "${schema}"."${funcName}"() RETURNS trigger AS $$ ${
      declareBlock
        ? `${declareBlock}
`
        : ''
    }BEGIN ${statementBody} END;$$ LANGUAGE plpgsql;`;
  }

  // Generate CREATE TRIGGER SQL (idempotent unless INSTEAD OF)
  #buildSqlTrigger(
    triggerName: string,
    schema: string,
    table: string,
    funcName: string,
    event: string,
    level: string,
    timing: string,
    when?: string,
  ): string {
    const levelClause = `FOR EACH ${level.toUpperCase()}`;
    const whenClause = when ? ` WHEN (${when})` : '';

    return `CREATE TRIGGER "${triggerName}" ${timing} ${event} ON "${schema}"."${table}" ${whenClause}${levelClause} EXECUTE FUNCTION "${schema}"."${funcName}"();`;
  }

  // Generate DROP TRIGGER IF EXISTS for safe replacement
  #buildDropTriggerSql(
    triggerName: string,
    schema: string,
    table: string,
  ): string {
    return `DROP TRIGGER IF EXISTS "${triggerName}" ON "${schema}"."${table}"`;
  }

  static #createTableColumns(
    tableName: string,
    columns: ColumnRecord,
    constraints?: CompositeUniqueConstraint[],
  ): string {
    const colDefs = Object.entries(columns)
      .map(([name, col]) => ` ${col.toSQL(name, tableName)}`)
      .join(',\n');

    const constraintDefs = constraints
      ? constraints.map(
          (c) =>
            `, CONSTRAINT "${c.name}" UNIQUE (${c.columns.map((col) => `"${col}"`).join(', ')})`,
        )
      : '';

    return `CREATE TABLE IF NOT EXISTS ${tableName} (\n${colDefs}${constraintDefs}\n)`;
  }

  async find<TKeys extends keyof TCols & string>(
    options: FindOptions<TCols, TKeys>,
  ) {
    const { select, where } = options;
    const cols = select ? select.map((col) => `"${col}"`).join(', ') : '*';
    if (!where)
      return this.#select<Prettify<InferRow<Pick<TCols, TKeys>>>>(cols);
    const { sql, values } = this.#buildWhere(where);
    return this.#select<Prettify<InferRow<Pick<TCols, TKeys>>>>(
      cols,
      sql,
      values,
    );
  }

  async findById(id: string) {
    return ORM.#query(`SELECT * FROM ${this.#tableName} WHERE id = $1`, [id]);
  }

  #buildWhere(where: WhereOptions<TCols>) {
    const values: SqlValue[] = [];
    const conditions: string[] = [];

    Object.entries(where).forEach(([columnName, value]) => {
      if (value === undefined) return;
      if (value === null) return conditions.push(`"${columnName}" IS NULL`);
      values.push(value);
      return conditions.push(`"${columnName}" = $${values.length}`);
    });

    return {
      sql: conditions.length ? ` WHERE ${conditions.join(' AND ')}` : undefined,
      values: conditions.length && values.length ? values : undefined,
    };
  }

  async #select<TRow extends QueryResultRow>(
    cols: string,
    whereSql = '',
    values?: SqlValue[],
  ): Promise<TRow[]> {
    return ORM.#query<TRow>(
      `SELECT ${cols} FROM ${this.#tableName}${whereSql}`,
      values,
    );
  }
}
