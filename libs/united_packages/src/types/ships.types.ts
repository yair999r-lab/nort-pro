export interface ShipInterface {
  ship_id: number;
  ship_name: string;
  route_id: number | null;
  capacity_weight_kg: number;
  speed_knots: number;
  fuel_consumption_tons_per_day: number;
  home_port_id: number;
  current_port_id: number | null;
  status: string;
}