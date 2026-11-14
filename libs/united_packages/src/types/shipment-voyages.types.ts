export interface ShipmentVoyageInterface {
  shipment_id: number;
  route_id: number | null;
  voyage_id: number;
  leg_order: number;
}
