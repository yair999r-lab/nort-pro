import { UUID } from 'crypto';

export interface OrdersInterface {
  id: UUID;
  customer: UUID;
  weight: number;
  created_at: number;
  delivery_date: number;
  allocated_at: number | null;
  destination: UUID;
  target: UUID;
  status: 'ממתינה לציוות' | 'נשלחה' | 'הושלמה' | 'בוטלה';
  event_id: UUID | null;
  ship_id: UUID | null;
}

export interface NorthwindOrderInterface {
  order_id: number;
  customer_id: string;
  employee_id: number;
  order_date: string;
  required_date: string;
  shipped_date: string | null;
  ship_via: number;
  freight: number;
  ship_name: string;
  ship_address: string;
  ship_city: string;
  ship_region: string | null;
  ship_postal_code: string;
  ship_country: string;
}
