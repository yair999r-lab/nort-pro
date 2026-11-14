import { queryToPostgres } from '@libs/global';

import {
  insertShipmentVoyagesQuery,
  selectShipmentVoyagesByShipmentIdQuery,
  selectAllShipmentVoyagesQuery,
} from '../helpers/shipment-voyages.helpers';

import type { ShipmentVoyageInterface } from '@libs/united_packages/src/types/shipment-voyages.types';
import type { ShipmentVoyageDbRow } from '../types/shipment-voyages.db.types';

export const insertShipmentVoyagesDAL = async (
  links: ShipmentVoyageInterface[],
): Promise<ShipmentVoyageDbRow[]> => {
  if (links.length === 0) return [];

  const values = links.flatMap((link) => [
    link.shipment_id,
    link.route_id,
    link.voyage_id,
    link.leg_order,
  ]);

  return queryToPostgres<ShipmentVoyageInterface, ShipmentVoyageDbRow>(
    insertShipmentVoyagesQuery(links.length),
    values,
  );
};

export const getShipmentVoyagesByShipmentIdDAL = async (
  shipmentId: number,
): Promise<ShipmentVoyageDbRow[]> => {
  return queryToPostgres<{ shipment_id: number }, ShipmentVoyageDbRow>(
    selectShipmentVoyagesByShipmentIdQuery(),
    [shipmentId],
  );
};

export const getAllShipmentVoyagesDAL = async (): Promise<
  ShipmentVoyageDbRow[]
> => {
  return queryToPostgres<ShipmentVoyageInterface, ShipmentVoyageDbRow>(
    selectAllShipmentVoyagesQuery(),
  );
};
