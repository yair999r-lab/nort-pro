import type {
  PortInterface,
  PortStatus,
} from '@libs/united_packages/src/types/ports.types';

import { getAllPortsDAL } from '../dal/ports.dal';

export const getAllPortsService = async (): Promise<PortInterface[]> => {
  const ports = await getAllPortsDAL();

  return ports.map((port) => ({
    port_id: port.port_id,
    port_name: port.port_name,
    city: port.city,
    country: port.country,
    latitude:
      port.latitude === null ? null : Number(port.latitude),
    longitude:
      port.longitude === null ? null : Number(port.longitude),
    status: port.status as PortStatus,
  }));
};