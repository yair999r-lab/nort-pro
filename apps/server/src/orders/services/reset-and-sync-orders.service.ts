import { NODE_ENV, withPostgresTransaction } from '@libs/global';
import type { PoolClient } from 'pg';

import { getNewOrderLinesDAL } from '../dal/orders.dal';

import {
  mapOrderLineToShipment,
  ShipmentToInsert,
} from '../helpers/map-order-line-to-shipment.helpers';

import { insertShipmentsQuery } from '../helpers/orders.helpers';

import { generateMissingShipmentWeightsQuery } from '../../shipments/helpers/shipments.helpers';

const BATCH_SIZE = 500;

// מחיקת נתוני הסימולציה הישנים
const resetSimulation = async (client: PoolClient) => {
  const execute = async (query: string) => {
    const result = await client.query(query);
    return result.rowCount ?? 0;
  };

  const reset = {
    shipmentVoyages: await execute(`
      DELETE FROM united_packages.shipment_voyages
    `),

    shipments: await execute(`
      DELETE FROM united_packages.shipments
    `),

    routeVoyages: await execute(`
      DELETE FROM united_packages.route_voyages
    `),

    routeStops: await execute(`
      DELETE FROM united_packages.route_stops
    `),

    voyages: await execute(`
      DELETE FROM united_packages.voyages
    `),

    dynamicRoutes: await execute(`
      DELETE FROM united_packages.routes
      WHERE route_kind = 'trip_plan'
    `),

    portDistances: await execute(`
      DELETE FROM united_packages.port_distances
    `),

    shipsReturnedHome: await execute(`
      UPDATE united_packages.ships
      SET current_port_id = home_port_id
      WHERE current_port_id IS DISTINCT FROM home_port_id
    `),

    fixedRoutesReset: await execute(`
      UPDATE united_packages.routes
      SET
        estimated_return_at = NULL,
        actual_return_at = NULL
      WHERE route_kind = 'legacy_template'
    `),
  };

  return reset;
};

// הכנסת המשלוחים דרך חיבור הטרנזקציה
const insertShipments = async (
  client: PoolClient,
  shipments: ShipmentToInsert[],
) => {
  let insertedCount = 0;

  for (let i = 0; i < shipments.length; i += BATCH_SIZE) {
    const batch = shipments.slice(i, i + BATCH_SIZE);

    const values = batch.flatMap((shipment) => [
      shipment.source_order_id,
      shipment.source_product_id,
      shipment.product_name,
      shipment.quantity,
      shipment.required_arrival,
      shipment.origin_port_id,
      shipment.destination_port_id,
    ]);

    const result = await client.query(
      insertShipmentsQuery(batch.length),
      values,
    );

    insertedCount += result.rowCount ?? 0;
  }

  return insertedCount;
};

export const resetAndSyncOrdersService = async () => {
  if (NODE_ENV !== 'development') {
    throw new Error('Full simulation reset is allowed only in development');
  }

  // שליפת נתוני המקור לפני תחילת המחיקה
  const orderLines = await getNewOrderLinesDAL(false);

  if (orderLines.length === 0) {
    throw new Error('Reset cancelled: no source order lines were found');
  }

  // רק שורות עם שני נמלים ממופים יכולות להפוך למשלוחים
  const mappedLines = orderLines.filter(
    (line) => line.origin_port_id !== null && line.destination_port_id !== null,
  );

  if (mappedLines.length === 0) {
    throw new Error('Reset cancelled: no mapped shipments were found');
  }

  const shipments = mappedLines.map(mapOrderLineToShipment);

  // כל פעולות המחיקה וההכנסה באותה טרנזקציה
  return withPostgresTransaction(async (client) => {
    const deleted = await resetSimulation(client);

    const inserted = await insertShipments(client, shipments);

    if (inserted !== shipments.length) {
      throw new Error(
        `Reset cancelled: expected ${shipments.length} shipments, inserted ${inserted}`,
      );
    }

    const weightsResult = await client.query(
      generateMissingShipmentWeightsQuery(),
    );

    if (weightsResult.rowCount !== inserted) {
      throw new Error(
        `Reset cancelled: expected ${inserted} weights, generated ${weightsResult.rowCount}`,
      );
    }

    return {
      fetched: orderLines.length,
      eligible: shipments.length,
      unmapped: orderLines.length - mappedLines.length,
      deleted,
      inserted,
      skipped: shipments.length - inserted,
      generatedWeights: weightsResult.rowCount ?? 0,
    };
  });
};
