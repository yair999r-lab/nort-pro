import type { QueryResultRow } from 'pg';

export interface VoyageDbRow extends QueryResultRow {
  voyage_id: number;
  ship_id: number;
  origin_port_id: number;
  destination_port_id: number;
  distance_nm: string;
  departure_date: string;
  estimated_arrival: string;
  current_load_weight_kg: string;
  status: string;
}

export interface VoyageToInsert {
  ship_id: number;
  origin_port_id: number;
  destination_port_id: number;
  distance_nm: number;
  departure_date: string;
  estimated_arrival: string;
  current_load_weight_kg: number;
}

export interface InsertedVoyageRow extends QueryResultRow {
  voyage_id: number;
}