import type { QueryResultRow } from 'pg';

export interface ShipmentVoyageDbRow extends QueryResultRow {
  shipment_id: number;
  route_id: number | null;
  voyage_id: number;
  leg_order: number;
}