export type NormalizedOrder = {
  id: string;
  customerId: string;
  orderDate: string;
  requiredDate: string;
  shippedDate: string | null;
  shipVia: number;
  freight: number;
  recipientName: string;
  deliveryAddress: string;
};