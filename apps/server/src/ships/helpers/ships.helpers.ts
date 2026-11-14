export const selectAllShipsQuery = () => {
  return `
    SELECT
      ship_id,
      ship_name,
      route_id,
      capacity_weight_kg,
      speed_knots,
      fuel_consumption_tons_per_day,
      fuel_capacity_tons,
      fuel_consumption_tons_per_nm,
      home_port_id,
      current_port_id,
      status
    FROM united_packages.ships
    ORDER BY ship_id ASC
  `;
};