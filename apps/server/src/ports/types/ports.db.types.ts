import type { QueryResultRow } from 'pg';

export interface PortDbRow extends QueryResultRow {
  port_id: number;
  port_name: string;
  city: string;
  country: string;
  latitude: string | null;
  longitude: string | null;
  status: string;
}