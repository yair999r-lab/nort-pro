export interface RouteInterface {
  route_id: number;
  route_name: string;
  start_port_id: number;
  end_port_id: number;
  total_length_nm: number;
  status: string;

  ship_id: number | null;
  route_kind: string;
  planned_departure_at: string | null;
  return_deadline_at: string | null;
  estimated_return_at: string | null;
  actual_return_at: string | null;
  plan_version: number;
  is_current_plan: boolean;
}