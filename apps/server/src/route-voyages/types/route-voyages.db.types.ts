import type { QueryResultRow } from 'pg';

export interface RouteVoyageDbRow extends QueryResultRow {
  route_id: number;
  voyage_id: number;
  segment_order: number;
}