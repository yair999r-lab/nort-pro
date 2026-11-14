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

export interface ShipDbRow extends QueryResultRow {
  ship_id: number;
  ship_name: string;
  route_id: number;
  capacity_weight_kg: string;
  speed_knots: string;
  fuel_consumption_tons_per_day: string;
  home_port_id: number;
  current_port_id: number | null;
  status: string;
}

export interface RouteDbRow extends QueryResultRow {
  route_id: number;
  route_name: string;
  start_port_id: number;
  end_port_id: number;
  total_length_nm: string;
  status: string;
}

export interface RouteStopDbRow extends QueryResultRow {
  route_id: number;
  port_id: number;
  stop_order: number;
}

export interface RouteVoyageDbRow extends QueryResultRow {
  route_id: number;
  voyage_id: number;
  segment_order: number;
}

export interface ShipmentDbRow extends QueryResultRow {
  shipment_id: number;
  source_order_id: number;
  source_product_id: number;
  origin_port_id: number;
  destination_port_id: number;
  assigned_route_id: number | null;
  manual_voyage_id: number | null;
  total_weight_kg: string | null;
  status: string;
  product_name: string | null;
  quantity: number | null;
  required_arrival: string | null;
}

export interface VoyageDbRow extends QueryResultRow {
  voyage_id: number;
  ship_id: number;
  origin_port_id: number;
  destination_port_id: number;
  distance_nm: string;
  departure_date: Date;
  estimated_arrival: Date;
  current_load_weight_kg: string;
  status: string;
}