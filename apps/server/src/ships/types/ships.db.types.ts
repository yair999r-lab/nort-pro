import type { QueryResultRow } from 'pg';

export interface ShipDbRow extends QueryResultRow {
  ship_id: number;
  ship_name: string;
  route_id: number | null;
  capacity_weight_kg: string;
  speed_knots: string;
  fuel_consumption_tons_per_day: string;
  fuel_capacity_tons: string | null;
  fuel_consumption_tons_per_nm: string | null;
  home_port_id: number;
  current_port_id: number | null;
  status: string;
}