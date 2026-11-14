import type { TableInfoInterface } from '@/global/types/generic-table.types';

import type {
  ShipmentAllocationRow,
  ShipAllocationRow,
  RouteAllocationRow,
  VoyageAllocationRow,
} from '../types/allocation-view.types';

// טבלת משלוחים
export const SHIPMENT_ALLOCATION_TABLE_INFO: TableInfoInterface<ShipmentAllocationRow>[] =
  [
    { label: 'מזהה משלוח', key: 'id' },
    { label: 'תיאור', key: 'description' },
    { label: 'נמל מוצא', key: 'originPortName' },
    { label: 'נמל יעד', key: 'destinationPortName' },
    { label: 'משקל', key: 'weightDisplay' },
    { label: 'מועד הגעה נדרש', key: 'requiredArrivalDisplay' },
  ];

// טבלת אוניות
export const SHIP_ALLOCATION_TABLE_INFO: TableInfoInterface<ShipAllocationRow>[] =
  [
    { label: 'שם האונייה', key: 'name' },
    { label: 'קיבולת', key: 'capacityDisplay' },
    { label: 'מהירות (קשרים)', key: 'speedKnots' },
    { label: 'מרחק המסלול', key: 'totalDistanceDisplay' },
    { label: 'מועד חזרה משוער', key: 'estimatedReturnAtDisplay' },
  ];

// טבלת מסלולים
export const ROUTE_ALLOCATION_TABLE_INFO: TableInfoInterface<RouteAllocationRow>[] =
  [
    { label: 'תוכנית מסלול', key: 'name' },
    { label: 'אונייה', key: 'shipName' },
    { label: 'תחנות במסלול', key: 'stopsDisplay' },
    { label: 'יציאה מתוכננת', key: 'departureAtDisplay' },
    { label: 'חזרה משוערת', key: 'estimatedReturnAtDisplay' },
    { label: 'מועד חזרה אחרון', key: 'returnDeadlineAtDisplay' },
  ];

// טבלת הפלגות
export const VOYAGE_ALLOCATION_TABLE_INFO: TableInfoInterface<VoyageAllocationRow>[] =
  [
    { label: 'נמל יציאה', key: 'fromPortName' },
    { label: 'נמל הגעה', key: 'toPortName' },
    { label: 'מרחק (מייל ימי)', key: 'distanceDisplay' },
    { label: 'מועד יציאה', key: 'departureAtDisplay' },
    { label: 'מועד הגעה', key: 'arrivalAtDisplay' },
    { label: 'משלוחים במקטע', key: 'cargoStatusDisplay' },
  ];
