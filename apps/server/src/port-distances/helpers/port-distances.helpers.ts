export const selectAllPortDistancesQuery = () => {
  return `
    SELECT
      from_port_id,
      to_port_id,
      distance_nm,
      distance_source,
      route_geometry
    FROM united_packages.port_distances
    ORDER BY from_port_id ASC, to_port_id ASC
  `;
};

export const selectPortDistanceByPortsQuery = () => {
  return `
    SELECT
      from_port_id,
      to_port_id,
      distance_nm,
      distance_source,
      route_geometry
    FROM united_packages.port_distances
    WHERE from_port_id = $1
      AND to_port_id = $2
    LIMIT 1
  `;
};

export const insertPortDistanceQuery = () => {
  return `
    INSERT INTO united_packages.port_distances (
      from_port_id,
      to_port_id,
      distance_nm,
      distance_source,
      route_geometry
    )
    VALUES ($1, $2, $3, $4, $5::jsonb)
    ON CONFLICT (from_port_id, to_port_id) DO NOTHING
    RETURNING *
  `;
};

export const updatePortDistanceGeometryQuery = () => {
  return `
    UPDATE united_packages.port_distances
    SET route_geometry = $3::jsonb
    WHERE from_port_id = $1
      AND to_port_id = $2
      AND route_geometry IS NULL
    RETURNING *
  `;
};