import { Column } from '../models/Column';
import {
  SafeAction,
  ColumnCompare,
  UnsafeAction,
  SqlValue,
} from '../types/orm.types';

const REGEX_DEFAULT = /::[\w\s"]+$/;

type ParsedTableReturnType = { schema: string; table: string };

export const parseTableName = (
  tableFullName: string,
): ParsedTableReturnType => {
  const [first, second] = tableFullName.split('.');
  return second
    ? { schema: first, table: second }
    : { schema: 'public', table: first };
};

const fullTableName = (tableFullName: string): string => {
  const { schema, table } = parseTableName(tableFullName);
  return `"${schema}"."${table}"`;
};

const qualifySqlType = (
  tableFullName: string,
  columnConfig: { sqlType: string; enum?: string[] },
): string => {
  if (
    columnConfig.enum &&
    !columnConfig.sqlType.includes('.') &&
    !columnConfig.sqlType.includes('"')
  ) {
    const { schema } = parseTableName(tableFullName);
    return `"${schema}".${columnConfig.sqlType}`;
  }
  return columnConfig.sqlType;
};

export const normalizeType = (
  dataType: string,
  maxLength: number | null,
  enumType: string | null,
): string => {
  if (dataType === 'character varying')
    return maxLength ? `VARCHAR(${maxLength})` : 'VARCHAR';
  if (enumType && dataType.toLowerCase() === 'user-defined')
    return enumType.split('.').pop() || enumType;
  return dataType.toUpperCase();
};

export const normalizeDefault = (columnDefault: string): string =>
  columnDefault.replace(REGEX_DEFAULT, '');

export const addNewColumn = (
  tableFullName: string,
  columnName: string,
  column: Column<SqlValue>,
) => {
  const safe: SafeAction[] = [];
  const unsafe: UnsafeAction[] = [];
  const qualifiedType = qualifySqlType(tableFullName, column.config);
  const colDef = `"${columnName}" ${qualifiedType}`;
  if (column.config.defaultValue || !column.config.notNull)
    safe.push({
      description: `add column "${columnName}"`,
      sql: `ALTER TABLE ${tableFullName} ADD COLUMN ${colDef}${column.config.defaultValue ? ` DEFAULT ${column.config.defaultValue}` : ''}`,
    });
  else {
    safe.push({
      description: `add column "${columnName}" as nullable (NOT NULL without default)`,
      sql: `ALTER TABLE ${tableFullName} ADD COLUMN ${colDef}`,
    });
    unsafe.push({
      description: `column "${columnName}" is NOT NULL in schema - backfill values first`,
      manualSql: `ALTER TABLE ${tableFullName} ALTER COLUMN "${columnName}" SET NOT NULL`,
    });
  }

  return { safe, unsafe };
};

const compareType: ColumnCompare = ({
  tableFullName,
  columnName,
  column,
  dbColumn,
}) => {
  const unsafe: UnsafeAction[] = [];
  if (column.sqlType !== dbColumn.sqlType) {
    const sqlType = qualifySqlType(tableFullName, column);
    const usingClause = column.enum ? ` USING "${columnName}"::${sqlType}` : '';
    unsafe.push({
      description: `column "${columnName}": schema says ${column.sqlType}, DB has ${dbColumn.sqlType}`,
      manualSql: `ALTER TABLE ${tableFullName} ALTER COLUMN "${columnName}" TYPE ${sqlType}${usingClause}`,
    });
  }

  return { safe: [], unsafe };
};

const compareDefault: ColumnCompare = ({
  tableFullName,
  columnName,
  column,
  dbColumn,
}) => {
  const safe: SafeAction[] = [];
  if (
    column.defaultValue?.toLowerCase() !== dbColumn.defaultValue?.toLowerCase()
  )
    safe.push({
      description: `${column.defaultValue ? 'set' : 'drop'} default for "${columnName}"`,
      sql: column.defaultValue
        ? `ALTER TABLE ${tableFullName} ALTER COLUMN "${columnName}" SET DEFAULT ${column.defaultValue}`
        : `ALTER TABLE ${tableFullName} ALTER COLUMN "${columnName}" DROP DEFAULT`,
    });

  return { safe, unsafe: [] };
};

const compareNotNul: ColumnCompare = ({
  tableFullName,
  columnName,
  column,
  dbColumn,
}) => {
  const safe: SafeAction[] = [];
  const unsafe: UnsafeAction[] = [];
  if (column.notNull !== dbColumn.notNull) {
    if (column.notNull)
      unsafe.push({
        description: `column "${columnName}" should be NOT NULL but DB allows nulls`,
        manualSql: `ALTER TABLE ${tableFullName} ALTER COLUMN "${columnName}" SET NOT NULL`,
      });
    else
      safe.push({
        description: `drop NOT NULL for "${columnName}"`,
        sql: `ALTER TABLE ${tableFullName} ALTER COLUMN "${columnName}" DROP NOT NULL`,
      });
  }

  return { safe, unsafe };
};

const compareUnique: ColumnCompare = ({
  tableFullName,
  tableName,
  columnName,
  column,
  dbColumn,
}) => {
  const safe: SafeAction[] = [];
  const unsafe: UnsafeAction[] = [];
  if (!column.primaryKey && column.unique !== dbColumn.unique) {
    if (column.unique) {
      // Schema says unique but DB doesn't - add constraint using the pre-populated constraint name
      const constraintName =
        column.constraintName || `${tableName}_${columnName}_key`;
      safe.push({
        description: `add unique constraint for ${columnName}`,
        sql: `ALTER TABLE ${tableFullName} ADD CONSTRAINT "${constraintName}" UNIQUE ("${columnName}")`,
      });
    } else {
      // DB says unique but schema doesn't - drop using the actual DB constraint name
      const nameToDrop =
        dbColumn.constraintName || `${tableName}_${columnName}_key`;
      unsafe.push({
        description: `column "${columnName}" is UNIQUE in DB but not in schema`,
        manualSql: `ALTER TABLE ${tableFullName} DROP CONSTRAINT "${nameToDrop}"`,
      });
    }
  }

  return { safe, unsafe };
};

const comparePrimaryKey: ColumnCompare = ({ columnName, column, dbColumn }) => {
  const safe: SafeAction[] = [];
  const unsafe: UnsafeAction[] = [];
  if (column.primaryKey !== dbColumn.primaryKey)
    unsafe.push({
      description: `primary key mismstch on "${columnName}" - changing a PK is a manual operation`,
    });

  return { safe, unsafe };
};

const compareReference: ColumnCompare = ({
  tableFullName,
  tableName,
  columnName,
  column,
  dbColumn,
}) => {
  const unsafe: UnsafeAction[] = [];
  const columnRef = column.ref;
  const dbRef = dbColumn.ref;

  const refChanged =
    (columnRef && !dbRef) ||
    (!columnRef && dbRef) ||
    (columnRef &&
      dbRef &&
      (fullTableName(columnRef.table) !== fullTableName(dbRef.table) ||
        columnRef.column !== dbRef.column));
  if (refChanged)
    unsafe.push({
      description: `foreigen key mismatch on "${columnName}"`,
      manualSql: columnRef
        ? `ALTER TABLE ${tableFullName} ADD CONSTRAINT "${tableName}_${columnName}_fkey" FOREIGN KEY ("${columnName}") REFERENCES ${fullTableName(
            columnRef.table,
          )}("${columnRef.column}");`
        : `ALTER TABLE ${tableFullName} DROP CONSTRAINT "${tableName}_${columnName}_fkey";`,
    });

  return { safe: [], unsafe };
};

const COMPARE_COLUMNS: ColumnCompare[] = [
  compareType,
  compareDefault,
  compareNotNul,
  compareUnique,
  comparePrimaryKey,
  compareReference,
];

export default COMPARE_COLUMNS;
