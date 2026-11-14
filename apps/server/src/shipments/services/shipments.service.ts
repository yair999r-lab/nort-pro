import type { ShipmentInterface } from '@libs/united_packages';

import { getAllShipmentsDAL } from '../dal/shipments.dal';

export const getAllShipmentsService = async (): Promise<
  ShipmentInterface[]
> => {
  const shipments = await getAllShipmentsDAL();

  const validShipments = shipments.filter(
    (shipment) =>
      shipment.total_weight_kg !== null && Number(shipment.total_weight_kg) > 0,
  );
  return validShipments.map((shipment) => ({
    shipment_id: shipment.shipment_id,
    source_order_id: shipment.source_order_id,
    source_product_id: shipment.source_product_id,
    product_name: shipment.product_name,
    quantity: shipment.quantity,
    required_arrival: shipment.required_arrival,
    origin_port_id: shipment.origin_port_id,
    destination_port_id: shipment.destination_port_id,
    assigned_route_id: shipment.assigned_route_id,
    manual_voyage_id: shipment.manual_voyage_id,
    total_weight_kg: Number(shipment.total_weight_kg),
    status: shipment.status,
  }));
};
