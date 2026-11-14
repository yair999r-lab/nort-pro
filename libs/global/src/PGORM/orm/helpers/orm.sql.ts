// Query raw trigger metadata + pg_get_triggerdef for accurate decoding of tgtype
// (PostgreSQL's own tgtype smallint encoding is implementation-internal and varies
// across versions - pg_get_triggerdef reliably decodes it.)
export const getSqlTriggersInSchema = `SELECT
        trigger_definition.tgname                             AS trigger_name,
        function_definition.proname                           AS trigger_function_name,
        function_schema_definition.nspname                    AS trigger_function_schema,
        table_definition.relname                              AS table_name,
        pg_get_triggerdef(trigger_definition.oid)             AS trigger_def
    FROM pg_trigger AS trigger_definition
    JOIN pg_class AS table_definition
      ON table_definition.oid = trigger_definition.tgrelid
    JOIN pg_namespace AS table_schema_definition
      ON table_schema_definition.oid = table_definition.relnamespace
    JOIN pg_proc AS function_definition
      ON function_definition.oid = trigger_definition.tgfoid
    JOIN pg_namespace AS function_schema_definition
      ON function_schema_definition.oid = function_definition.pronamespace
    WHERE table_schema_definition.nspname = $1
      AND NOT trigger_definition.tgisinternal`;

export const dropAllTriggersInTablesSql = `SELECT
        trigger_definition.tgname               AS trigger_name,
        table_definition.relname                AS table_name,
        table_schema_definition.nspname         AS table_schema_name,
        function_definition.proname             AS trigger_function_name,
        function_schema_definition.nspname      AS function_schema_name
    FROM pg_trigger AS trigger_definition
    JOIN pg_class AS table_definition
      ON table_definition.oid = trigger_definition.tgrelid
    JOIN pg_namespace AS table_schema_definition
      ON table_schema_definition.oid = table_definition.relnamespace
    JOIN pg_proc AS function_definition
      ON function_definition.oid = trigger_definition.tgfoid
    JOIN pg_namespace AS function_schema_definition
      ON function_schema_definition.oid = function_definition.pronamespace
    WHERE table_schema_definition.nspname = $1
      AND table_definition.relname = $2
      AND NOT trigger_definition.tgisinternal`;

export const fkTablesSql = `
    SELECT DISTINCT
      ccu.table_schema,
      ccu.table_name,
      ccu.column_name,
      tc.constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
      AND tc.table_schema = ccu.table_schema
    JOIN information_schema.constraint_column_usage ccu_ref
      ON tc.constraint_name = ccu_ref.constraint_name
      AND tc.table_schema = ccu_ref.table_schema
    WHERE ccu_ref.table_schema = $1
      AND ccu_ref.table_name = $2
      AND tc.constraint_type = 'FOREIGN KEY'
  `;
