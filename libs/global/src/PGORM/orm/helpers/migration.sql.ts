export const COLUMNS_SQL = `
    SELECT column_name, data_type, udt_name AS enum_type, character_maximum_length, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = $1 AND table_name = $2`;

export const COMPOSITE_CONSTRAINTS_SQL = `
    SELECT
        tc.constraint_name,
        kcu.column_name,
        kcu.ordinal_position
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema AND tc.table_name = kcu.table_name
    WHERE tc.table_schema = $1 AND tc.table_name = $2 AND tc.constraint_type = 'UNIQUE'
      AND tc.constraint_name IN (
        SELECT constraint_name
        FROM information_schema.key_column_usage
        WHERE table_schema = $1 AND table_name = $2
        GROUP BY constraint_name
        HAVING COUNT(*) > 1
      )
    ORDER BY tc.constraint_name, kcu.ordinal_position;
`;

export const CONSTRAINTS_SQL = `
    SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        CASE
            WHEN tc.constraint_type = 'FOREIGN KEY' THEN ccu.table_schema
            ELSE NULL
        END AS foreign_schema,
        CASE
            WHEN tc.constraint_type = 'FOREIGN KEY' THEN ccu.table_name
            ELSE NULL
        END AS foreign_table,
        CASE
            WHEN tc.constraint_type = 'FOREIGN KEY' THEN ccu.column_name
            ELSE NULL
        END AS foreign_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name AND tc.table_schema = rc.constraint_schema
    LEFT JOIN information_schema.key_column_usage ccu ON rc.unique_constraint_name = ccu.constraint_name AND rc.unique_constraint_schema = ccu.table_schema AND ccu.ordinal_position = kcu.position_in_unique_constraint
    WHERE tc.table_schema = $1 AND tc.table_name = $2 AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY')
    ORDER BY tc.constraint_name, kcu.column_name;`;