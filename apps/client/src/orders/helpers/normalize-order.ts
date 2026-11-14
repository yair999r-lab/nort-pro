import type { NorthwindOrderInterface } from '@libs/united_packages';
import type { NormalizedOrder } from '../types/orders.types';

const formatDate = (value: string | null): string => {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('he-IL');
};

export const normalizeOrder = (
  order: NorthwindOrderInterface,
): NormalizedOrder => ({
  id: String(order.order_id),
  customerId: order.customer_id,
  orderDate: formatDate(order.order_date),
  requiredDate: formatDate(order.required_date),
  shippedDate: order.shipped_date
    ? formatDate(order.shipped_date)
    : null,
  shipVia: order.ship_via,
  freight: order.freight,
  recipientName: order.ship_name,
  deliveryAddress: [
    order.ship_address,
    order.ship_city,
    order.ship_region,
    order.ship_postal_code,
    order.ship_country,
  ]
    .filter(Boolean)
    .join(', '),
});

export const normalizeOrders = (
  orders: NorthwindOrderInterface[],
): NormalizedOrder[] => orders.map(normalizeOrder);