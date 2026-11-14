import { queryToPostgres } from '@libs/global';
import {
  insertShipmentsQuery,
  selectAllFromOrdersQuery,
  selectNewOrderLinesQuery,
} from '../helpers/orders.helpers';

import type { QueryResultRow } from 'pg';
import {
  ShipmentToInsert,
  SourceOrderLine,
} from '../helpers/map-order-line-to-shipment.helpers';
interface InsertedShipmentRow extends QueryResultRow {
  shipment_id: number;
}

export const getAllOrdersDAL = async () => {
  try {
    const orders = await queryToPostgres(selectAllFromOrdersQuery());
    return orders;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getNewOrderLinesDAL = async (
  excludeExisting = true,
) => {
  return queryToPostgres<SourceOrderLine, SourceOrderLine & QueryResultRow>(
    selectNewOrderLinesQuery(excludeExisting),
  );
};

export const insertShipmentsDAL = async (shipments: ShipmentToInsert[]) => {
  if (shipments.length === 0) return [];

  const values = shipments.flatMap((shipment) => [
    shipment.source_order_id,
    shipment.source_product_id,
    shipment.product_name,
    shipment.quantity,
    shipment.required_arrival,
    shipment.origin_port_id,
    shipment.destination_port_id,
  ]);

  return queryToPostgres<ShipmentToInsert, InsertedShipmentRow>(
    insertShipmentsQuery(shipments.length),
    values,
  );
};
