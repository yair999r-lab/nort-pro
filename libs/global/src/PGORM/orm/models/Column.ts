import { ColumnConfig, ColumnRef, SqlValue } from '../types/orm.types';

export class Column<T extends SqlValue> {
  #config: ColumnConfig;

  constructor(
    sqlType: string,
    config?: Partial<Omit<ColumnConfig, 'sqlType'>>,
  ) {
    this.#config = {
      sqlType,
      notNull: true,
      primaryKey: false,
      unique: false,
      ...config,
    };
  }

  get config(): Readonly<ColumnConfig> {
    return this.#config;
  }

  resolveSqlType(sqlType: string) {
    this.#config.sqlType = sqlType;
  }

  resolveConstraintName(name: string) {
    this.#config.constraintName = name;
  }

  isNullable(): Column<T | null> {
    return new Column<T | null>(this.#config.sqlType, {
      ...this.#config,
      notNull: false,
    });
  }

  primaryKey(): Column<NonNullable<T>> {
    return new Column<NonNullable<T>>(this.#config.sqlType, {
      ...this.#config,
      primaryKey: true,
      notNull: true,
    });
  }

  unique(): Column<NonNullable<T>> {
    return new Column<NonNullable<T>>(this.#config.sqlType, {
      ...this.#config,
      unique: true,
      constraintName: undefined,
    });
  }

  default(value: string): Column<NonNullable<T>> {
    return new Column<NonNullable<T>>(this.#config.sqlType, {
      ...this.#config,
      defaultValue: value,
    });
  }

  ref(ref: ColumnRef<T>): Column<T> {
    return new Column<T>(this.#config.sqlType, {
      ...this.#config,
      ref: { table: ref.table, column: ref.column },
    });
  }

  #parseRefTableName(tableFullName: string): { schema: string; table: string } {
    const [first, second] = tableFullName.split('.');
    return second
      ? { schema: first, table: second }
      : { schema: 'public', table: first };
  }

  toSQL(name: string, tableFullName?: string) {
    let sqlType = this.#config.sqlType;
    if (
      tableFullName &&
      this.#config.enum &&
      !sqlType.includes('.') &&
      !sqlType.includes('"')
    ) {
      const [schema] = tableFullName.split('.');
      sqlType = `"${schema}".${sqlType}`;
    }
    const parts: string[] = [`"${name}"`, sqlType];

    if (this.#config.defaultValue)
      parts.push(`DEFAULT ${this.#config.defaultValue}`);
    if (this.#config.primaryKey) parts.push('PRIMARY KEY');
    if (this.#config.notNull && !this.#config.primaryKey)
      parts.push('NOT NULL');
    if (this.#config.unique && !this.#config.primaryKey) parts.push('UNIQUE');
    if (this.#config.ref) {
      const { table, column } = this.#config.ref;
      const { schema, table: tableName } = this.#parseRefTableName(table);
      parts.push(`REFERENCES "${schema}"."${tableName}"("${column}")`);
    }

    return parts.join(' ');
  }
}
