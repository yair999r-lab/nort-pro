export type PortStatus = 'active' | 'inactive';

export interface PortInterface {
  port_id: number;
  port_name: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  status: PortStatus;
}