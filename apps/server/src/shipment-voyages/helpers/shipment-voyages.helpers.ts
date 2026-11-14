export const insertShipmentVoyagesQuery = (rowsCount: number) => {
  const placeholders = Array.from({ length: rowsCount }, (_, index) => {
    const start = index * 4 + 1;
    return `($${start}, $${start + 1}, $${start + 2}, $${start + 3})`;
  });

  return `
    INSERT INTO united_packages.shipment_voyages (
      shipment_id,
      route_id,
      voyage_id,
      leg_order
    )
    VALUES ${placeholders.join(', ')}
    ON CONFLICT (shipment_id, voyage_id) DO NOTHING
    RETURNING shipment_id, route_id, voyage_id, leg_order
  `;
};

export const selectShipmentVoyagesByShipmentIdQuery = () => `
  SELECT shipment_id, route_id, voyage_id, leg_order
  FROM united_packages.shipment_voyages
  WHERE shipment_id = $1
  ORDER BY route_id ASC NULLS FIRST, leg_order ASC
`;

export const selectAllShipmentVoyagesQuery = () => `
  SELECT shipment_id, route_id, voyage_id, leg_order
  FROM united_packages.shipment_voyages
  ORDER BY shipment_id ASC, route_id ASC NULLS FIRST, leg_order ASC
`;
