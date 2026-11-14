import { queryToPostgres } from '@libs/global';

import { selectAllShipmentsQuery } from '../helpers/shipments.helpers';
import type { ShipmentDbRow } from '../types/shipments.db.types';

import type { QueryResultRow } from 'pg';
import {
  generateMissingShipmentWeightsQuery,
  allocateShipmentQuery,
} from '../helpers/shipments.helpers';
import { assignShipmentsToRouteQuery } from '../helpers/shipments.helpers';

interface GeneratedShipmentWeightRow extends QueryResultRow {
  shipment_id: number;
  total_weight_kg: string;
}

export const generateMissingShipmentWeightsDAL = async (): Promise<
  GeneratedShipmentWeightRow[]
> => {
  return queryToPostgres<
    GeneratedShipmentWeightRow,
    GeneratedShipmentWeightRow
  >(generateMissingShipmentWeightsQuery());
};

export const getAllShipmentsDAL = async (): Promise<ShipmentDbRow[]> => {
  return queryToPostgres<ShipmentDbRow, ShipmentDbRow>(
    selectAllShipmentsQuery(),
  );
};

interface AllocatedShipmentRow extends QueryResultRow {
  shipment_id: number;
}

export const allocateShipmentDAL = async (
  shipmentId: number,
  routeId: number,
): Promise<boolean> => {
  const rows = await queryToPostgres<
    { shipment_id: number; route_id: number },
    AllocatedShipmentRow
  >(allocateShipmentQuery(), [shipmentId, routeId]);

  return rows.length > 0;
};

export const assignShipmentsToRouteDAL = async (
  routeId: number,
  shipmentIds: number[],
): Promise<boolean> => {
  if (shipmentIds.length === 0) return false;

  const uniqueIds = [...new Set(shipmentIds)];

  const rows = await queryToPostgres<
    { route_id: number; shipment_ids: number[] },
    AllocatedShipmentRow
  >(assignShipmentsToRouteQuery(), [routeId, uniqueIds]);

  return rows.length === uniqueIds.length;
};
