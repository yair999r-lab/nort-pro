import { TableInfoInterface } from "@/global/types/generic-table.types";

import { ShipmentTableRow } from "../types/shipping.types";

export const SHIPMENT_TABLE_INFO: TableInfoInterface<ShipmentTableRow>[] = [
  {
    label: 'מזהה',
    key: 'id',
  },
  {
    label: 'תיאור',
    key: 'description',
  },
  {
    label: 'נמל מוצא',
    key: 'originPortName',
  },
  {
    label: 'נמל יעד',
    key: 'destinationPortName',
  },
  {
    label: 'משקל',
    key: 'weightDisplay',
  },
  {
    label: 'מועד הגעה נדרש',
    key: 'requiredArrivalDisplay',
  },
];