import axios from 'axios';
import type { NorthwindOrderInterface } from '@libs/united_packages';

import type { ShipmentInterface } from '@libs/united_packages';

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export const getAllOrders = async (): Promise<NorthwindOrderInterface[]> => {
  const { data } = await axios.get<NorthwindOrderInterface[]>(
    `${SERVER_URL}/orders`,
  );

  return data;
};

export const getShipmentsByOrderId = async (
  orderId: number,
): Promise<ShipmentInterface[]> => {
  const { data } = await axios.get<ShipmentInterface[]>(
    `${SERVER_URL}/shipments`,
  );

  return data.filter(
    (shipment) => shipment.source_order_id === orderId,
  );
};