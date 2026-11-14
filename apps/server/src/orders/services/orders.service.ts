import {
  getAllOrdersDAL,
  getNewOrderLinesDAL,
  insertShipmentsDAL,
} from '../dal/orders.dal';
import { mapOrderLineToShipment } from '../helpers/map-order-line-to-shipment.helpers';

import { generateMissingShipmentWeightsDAL } from '../../shipments/dal/shipments.dal';

export const getAllOrdersService = async () => {
  try {
    const demos = await getAllOrdersDAL();
    return demos;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getNewOrderLinesService = async () => {
  const orderLines = await getNewOrderLinesDAL();

  return orderLines;
};

export const syncNewOrdersService = async () => {
  const orderLines = await getNewOrderLinesDAL();

  // רק שורות עם שני נמלים ממופים יכולות להפוך למשלוחים
  const mappedLines = orderLines.filter(
    (line) => line.origin_port_id !== null && line.destination_port_id !== null,
  );

  const unmappedCount = orderLines.length - mappedLines.length;

  let insertedCount = 0;

  if (mappedLines.length > 0) {
    const shipments = mappedLines.map(mapOrderLineToShipment);

    const insertedShipments = await insertShipmentsDAL(shipments);

    insertedCount = insertedShipments.length;
  }

  // יצירת משקלים חסרים
  const generatedWeights = await generateMissingShipmentWeightsDAL();

  return {
    fetched: orderLines.length,
    eligible: mappedLines.length,
    inserted: insertedCount,
    skipped: orderLines.length - insertedCount,
    unmapped: unmappedCount,
    generatedWeights: generatedWeights.length,
  };
};
