export const selectAllRouteVoyagesQuery = () => {
  return `
    SELECT
      route_id,
      voyage_id,
      segment_order
    FROM united_packages.route_voyages
    ORDER BY route_id ASC, segment_order ASC
  `;
};

export const insertRouteVoyageQuery = () => {
  return `
    INSERT INTO united_packages.route_voyages (
      route_id,
      voyage_id,
      segment_order
    )
    VALUES ($1, $2, $3)
    RETURNING route_id, voyage_id, segment_order
  `;
};

export const insertDynamicRoutePlanQuery = () => `
  INSERT INTO united_packages.routes (
    route_name,
    start_port_id,
    end_port_id,
    total_length_nm,
    status,
    ship_id,
    route_kind,
    planned_departure_at,
    return_deadline_at,
    estimated_return_at,
    plan_version,
    is_current_plan
  )
  VALUES (
    $1, $2, $3, $4,
    'inactive',
    $5, 'trip_plan',
    $6, $7, $8,
    COALESCE((
      SELECT MAX(plan_version) + 1
      FROM united_packages.routes
      WHERE ship_id = $5
        AND route_kind = 'trip_plan'
    ), 1),
    FALSE
  )
  RETURNING route_id, plan_version
`;

export const activateDynamicRoutePlanQuery = () => `
  UPDATE united_packages.routes
  SET
    is_current_plan = (route_id = $2),
    status = CASE
      WHEN route_id = $2 THEN 'active'
      ELSE 'inactive'
    END
  WHERE ship_id = $1
    AND route_kind = 'trip_plan'
    AND (is_current_plan = TRUE OR route_id = $2)
  RETURNING route_id
`;