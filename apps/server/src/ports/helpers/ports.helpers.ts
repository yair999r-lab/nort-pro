export const selectAllPortsQuery = () => {
  return `
    SELECT
      port_id,
      port_name,
      city,
      country,
      latitude,
      longitude,
      status
    FROM united_packages.ports
    ORDER BY port_id ASC
  `;
};

export const selectPortByIdQuery = () => {
  return `
    SELECT
      port_id,
      port_name,
      city,
      country,
      latitude,
      longitude,
      status
    FROM united_packages.ports
    WHERE port_id = $1
    LIMIT 1
  `;
};