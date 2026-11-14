export interface VoyageInterface {
  voyage_id: number;
  ship_id: number;
  origin_port_id: number;
  destination_port_id: number;
  distance_nm: number;
  departure_date: string;
  estimated_arrival: string;
  current_load_weight_kg: number;
  status: string;
}