import type { RouteVoyageInterface } from '@libs/united_packages';

import { getAllRouteVoyagesDAL } from '../dal/route-voyages.dal';

export const getAllRouteVoyagesService = async (): Promise<RouteVoyageInterface[]> => {
  const routeVoyages = await getAllRouteVoyagesDAL();

  return routeVoyages.map((item) => ({
    route_id: item.route_id,
    voyage_id: item.voyage_id,
    segment_order: item.segment_order,
  }));
};