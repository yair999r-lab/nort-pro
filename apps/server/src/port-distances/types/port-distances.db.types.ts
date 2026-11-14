import type { QueryResultRow } from 'pg';

export interface PortDistanceDbRow extends QueryResultRow {
  from_port_id: number;
  to_port_id: number;
  distance_nm: string;
  distance_source: string;
}


export interface PortRouteGeometry {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface PortDistanceDbRow extends QueryResultRow {
  from_port_id: number;
  to_port_id: number;
  distance_nm: string;
  distance_source: string;
  route_geometry: PortRouteGeometry | null;
}