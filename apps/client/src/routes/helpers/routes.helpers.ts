import type { TableInfoInterface } from '@/global/types/generic-table.types';
import type { NormalizedRoute } from '@/routes/types/routes.types';

export const ROUTE_TABLE_TILE_INFO: TableInfoInterface<NormalizedRoute>[] = [
  { label: 'מזהה', key: 'id' },
  { label: 'שם המסלול', key: 'name' },
  { label: 'נמל מוצא', key: 'startPortName' },
  { label: 'נמל יעד', key: 'endPortName' },
  { label: 'אורך (מייל ימי)', key: 'totalLengthNm' },
  { label: 'סטטוס', key: 'status' },
];