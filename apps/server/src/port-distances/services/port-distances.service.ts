import type { PortDistanceInterface } from '@libs/united_packages';

import { getAllPortDistancesDAL } from '../dal/port-distances.dal';

export const getAllPortDistancesService =
  async (): Promise<PortDistanceInterface[]> => {
    const distances = await getAllPortDistancesDAL();

    return distances.map((distance) => ({
      from_port_id: distance.from_port_id,
      to_port_id: distance.to_port_id,
      distance_nm: Number(distance.distance_nm),
      distance_source: distance.distance_source,
      route_geometry: distance.route_geometry,
    }));
  };