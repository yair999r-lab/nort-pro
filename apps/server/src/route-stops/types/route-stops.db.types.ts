import type { QueryResultRow } from 'pg';

export interface RouteStopDbRow extends QueryResultRow {
  route_id: number;
  port_id: number;
  stop_order: number;
  planned_arrival_at: Date | string | null;
  planned_departure_at: Date | string | null;
  actual_arrival_at: Date | string | null;
  actual_departure_at: Date | string | null;
  stop_status: string;
}