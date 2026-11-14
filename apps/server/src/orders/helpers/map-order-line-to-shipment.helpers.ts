export interface SourceOrderLine {
  source_order_id: number;
  source_product_id: number;
  product_name: string;
  quantity: number;
  required_date: string | null;
  origin_port_id: number | null;
  destination_port_id: number | null;
}

export interface ShipmentToInsert {
  source_order_id: number;
  source_product_id: number;
  product_name: string;
  quantity: number;
  required_arrival: string | null;
  origin_port_id: number;
  destination_port_id: number;
}

export const mapOrderLineToShipment = (
  orderLine: SourceOrderLine,
): ShipmentToInsert => {
  if (
    orderLine.origin_port_id == null ||
    orderLine.destination_port_id == null
  ) {
    throw new Error(
      `Missing port mapping for order ${orderLine.source_order_id}, product ${orderLine.source_product_id}`,
    );
  }

  return {
    source_order_id: orderLine.source_order_id,
    source_product_id: orderLine.source_product_id,
    product_name: orderLine.product_name,
    quantity: orderLine.quantity,
    required_arrival: orderLine.required_date,
    origin_port_id: orderLine.origin_port_id,
    destination_port_id: orderLine.destination_port_id,
  };
};