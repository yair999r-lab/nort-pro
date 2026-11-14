import type { TableInfoInterface } from '@/global/types/generic-table.types';
import type { NormalizedOrder } from '../types/orders.types';

export const ORDER_TABLE_TILE_INFO: TableInfoInterface<NormalizedOrder>[] = [
  { label: 'מזהה הזמנה', key: 'id' },
  { label: 'קוד לקוח', key: 'customerId' },
  { label: 'שם הנמען', key: 'recipientName' },
  { label: 'תאריך הזמנה', key: 'orderDate' },
  { label: 'תאריך אספקה נדרש', key: 'requiredDate' },
  { label: 'תאריך משלוח', key: 'shippedDate' },
  { label: 'דמי הובלה', key: 'freight' },
  { label: 'כתובת משלוח', key: 'deliveryAddress' },
];