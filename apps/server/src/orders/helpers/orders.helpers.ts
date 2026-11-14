import { NORTHWIND_SCHEMA } from '@libs/global';

export const selectAllFromOrdersQuery = () => {
  const query = `
    SELECT * FROM ${NORTHWIND_SCHEMA}.orders
  `;
  return query;
};

export const selectNewOrderLinesQuery = (excludeExisting = true) => {
  const existingShipmentFilter = excludeExisting
    ? `
      AND NOT EXISTS (
        SELECT 1
        FROM united_packages.shipments existing
        WHERE existing.source_order_id = o.order_id
          AND existing.source_product_id = od.product_id
      )
    `
    : '';

  const query = `
    SELECT
      o.order_id AS source_order_id,
      od.product_id AS source_product_id,

      p.product_name,
      od.quantity,
      od.unit_price,

      o.order_date,
      o.required_date,
      o.ship_via,

      s.supplier_id,
      s.company_name AS supplier_name,
      s.address AS origin_address,
      s.city AS origin_city,
      s.region AS origin_region,
      s.country AS origin_country,

      o.ship_name AS destination_name,
      o.ship_address AS destination_address,
      o.ship_city AS destination_city,
      o.ship_region AS destination_region,
      o.ship_country AS destination_country,

      origin_map.port_id AS origin_port_id,
      destination_map.port_id AS destination_port_id

    FROM ${NORTHWIND_SCHEMA}.orders o

    JOIN ${NORTHWIND_SCHEMA}.order_details od
      ON od.order_id = o.order_id

    JOIN ${NORTHWIND_SCHEMA}.products p
      ON p.product_id = od.product_id

    LEFT JOIN ${NORTHWIND_SCHEMA}.suppliers s
      ON s.supplier_id = p.supplier_id

    LEFT JOIN united_packages.location_port_map origin_map
      ON LOWER(TRIM(origin_map.country)) =
         LOWER(TRIM(s.country))
      AND origin_map.region =
        CASE
          WHEN UPPER(TRIM(s.country)) = 'USA'
          THEN COALESCE(NULLIF(UPPER(TRIM(s.region)), ''), 'MISSING')
          ELSE ''
        END

    LEFT JOIN united_packages.location_port_map destination_map
      ON LOWER(TRIM(destination_map.country)) =
         LOWER(TRIM(o.ship_country))
      AND destination_map.region =
        CASE
          WHEN UPPER(TRIM(o.ship_country)) = 'USA'
          THEN COALESCE(NULLIF(UPPER(TRIM(o.ship_region)), ''), 'MISSING')
          ELSE ''
        END

   WHERE
  o.ship_via = 2

  AND (
    origin_map.port_id IS NULL
    OR destination_map.port_id IS NULL
    OR (
      LOWER(TRIM(s.country)) <> LOWER(TRIM(o.ship_country))
      AND origin_map.port_id <> destination_map.port_id
    )
  )

${existingShipmentFilter}

    ORDER BY o.order_id ASC, od.product_id ASC
  `;

  return query;
};

const buildValuesPlaceholders = (rowsCount: number): string => {
  const columnsPerRow = 7;

  const rows = Array.from({ length: rowsCount }, (_, rowIndex) => {
    const placeholders = Array.from(
      { length: columnsPerRow },
      (_, columnIndex) => `$${rowIndex * columnsPerRow + columnIndex + 1}`,
    );

    return `(${placeholders.join(', ')})`;
  });

  return rows.join(', ');
};

export const insertShipmentsQuery = (rowsCount: number) => {
  return `
    INSERT INTO united_packages.shipments (
      source_order_id,
      source_product_id,
      product_name,
      quantity,
      required_arrival,
      origin_port_id,
      destination_port_id
    )
    VALUES ${buildValuesPlaceholders(rowsCount)}

    ON CONFLICT (source_order_id, source_product_id)
    DO NOTHING

    RETURNING shipment_id
  `;
};
