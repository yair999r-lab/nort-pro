import type { QueryResultRow } from 'pg';

export interface RouteDbRow extends QueryResultRow {
  route_id: number;
  route_name: string;
  start_port_id: number;
  end_port_id: number;
  total_length_nm: number | string;
  status: string;
  ship_id: number | null;
  route_kind: string;
  planned_departure_at: Date | string | null;
  return_deadline_at: Date | string | null;
  estimated_return_at: Date | string | null;
  actual_return_at: Date | string | null;
  plan_version: number;
  is_current_plan: boolean;
}