export const selectAllShipmentsQuery = () => {
  return `
    SELECT
      shipment_id,
      source_order_id,
      source_product_id,
      product_name,
      quantity,
      TO_CHAR(required_arrival, 'YYYY-MM-DD') AS required_arrival,
      origin_port_id,
      destination_port_id,
      assigned_route_id,
      manual_voyage_id,
      total_weight_kg,
      status
    FROM united_packages.shipments
    WHERE total_weight_kg IS NOT NULL
  AND total_weight_kg > 0
    ORDER BY shipment_id ASC
  `;
};

export const generateMissingShipmentWeightsQuery = () => {
  return `
    UPDATE united_packages.shipments
    SET total_weight_kg = ROUND(
      (
        (0.1 + RANDOM() * 19.9)
        * GREATEST(COALESCE(quantity, 1), 1)
      )::numeric,
      2
    )
    WHERE total_weight_kg IS NULL
    RETURNING shipment_id, total_weight_kg
  `;
};

export const allocateShipmentQuery = () => {
  return `
    UPDATE united_packages.shipments
    SET
      assigned_route_id = $2,
      status = 'assigned'
    WHERE
      shipment_id = $1
      AND status = 'pending'
      AND total_weight_kg IS NOT NULL
      AND total_weight_kg > 0
    RETURNING shipment_id
  `;
};

export const assignShipmentsToRouteQuery = () => {
  return `
    UPDATE united_packages.shipments
    SET
      assigned_route_id = $1,
      status = 'assigned'
    WHERE
      shipment_id = ANY($2::integer[])
      AND status IN ('pending', 'assigned')
      AND total_weight_kg IS NOT NULL
      AND total_weight_kg > 0
    RETURNING shipment_id
  `;
};