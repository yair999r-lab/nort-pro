import type { QueryResultRow } from 'pg';

export interface ShipmentDbRow extends QueryResultRow {
  shipment_id: number;
  source_order_id: number;
  source_product_id: number;
  product_name: string | null;
  quantity: number | null;
  required_arrival: string | null;
  origin_port_id: number;
  destination_port_id: number;
  assigned_route_id: number | null;
  manual_voyage_id: number | null;
  total_weight_kg: string;
  status: string;
}