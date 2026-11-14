export const selectAllVoyagesQuery = () => {
  return `
    SELECT
      voyage_id,
      ship_id,
      origin_port_id,
      destination_port_id,
      distance_nm,
      TO_CHAR(
        departure_date,
        'YYYY-MM-DD"T"HH24:MI:SS.US'
      ) AS departure_date,
      TO_CHAR(
        estimated_arrival,
        'YYYY-MM-DD"T"HH24:MI:SS.US'
      ) AS estimated_arrival,
      current_load_weight_kg,
      status
    FROM united_packages.voyages
    ORDER BY voyage_id ASC
  `;
};

export const insertVoyageQuery = () => {
  return `
    INSERT INTO united_packages.voyages (
      ship_id,
      origin_port_id,
      destination_port_id,
      distance_nm,
      departure_date,
      estimated_arrival,
      current_load_weight_kg
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING voyage_id
  `;
};

export const increaseVoyageLoadQuery = () => {
  return `
    UPDATE united_packages.voyages AS v
    SET current_load_weight_kg =
      v.current_load_weight_kg + $2
    FROM united_packages.ships AS s
    WHERE
      v.voyage_id = $1
      AND s.ship_id = v.ship_id
      AND $2 > 0
      AND v.current_load_weight_kg + $2 <= s.capacity_weight_kg
    RETURNING v.voyage_id
  `;
};