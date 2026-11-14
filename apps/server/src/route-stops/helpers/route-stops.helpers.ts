export const selectAllRouteStopsQuery = () => {
  return `
    SELECT
      route_id,
      port_id,
      stop_order,
      planned_arrival_at,
      planned_departure_at,
      actual_arrival_at,
      actual_departure_at,
      stop_status
    FROM united_packages.route_stops
    ORDER BY route_id ASC, stop_order ASC
  `;
};

export const insertDynamicRouteStopsQuery = (rowsCount: number) => {
  const placeholders = Array.from(
    { length: rowsCount },
    (_, index) => {
      const start = index * 5 + 1;

      return `(
        $${start},
        $${start + 1},
        $${start + 2},
        $${start + 3},
        $${start + 4},
        NULL,
        NULL,
        'planned'
      )`;
    },
  );

  return `
    INSERT INTO united_packages.route_stops (
      route_id,
      port_id,
      stop_order,
      planned_arrival_at,
      planned_departure_at,
      actual_arrival_at,
      actual_departure_at,
      stop_status
    )
    VALUES ${placeholders.join(', ')}
    RETURNING route_id, port_id, stop_order
  `;
};