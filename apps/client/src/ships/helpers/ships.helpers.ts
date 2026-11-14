import type { TableInfoInterface } from '@/global/types/generic-table.types';
import type { NormalizedShip } from '../types/ships.types';

export const SHIP_TABLE_TILE_INFO: TableInfoInterface<NormalizedShip>[] = [
  {
    label: 'מזהה',
    key: 'id',
  },
  {
    label: 'שם האונייה',
    key: 'name',
  },
  {
    label: 'נמל הבית',
    key: 'homePortId',
  },
  {
    label: 'נמל נוכחי',
    key: 'currentPortId',
  },
  {
    label: 'קיבולת (טון)',
    key: 'capacityTons',
  },
  {
    label: 'מהירות (קשר)',
    key: 'speedKnots',
  },
  {
    label: 'צריכת דלק (טון ליום)',
    key: 'fuelConsumptionTonsPerDay',
  },
  {
    label: 'מסלול',
    key: 'routeId',
  },
  {
    label: 'סטטוס',
    key: 'status',
  },
];