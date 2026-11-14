import type {
  AllocationShipment,
  AllocationRoute,
  AllocationRouteStop,
} from '../types/allocation.types';

import { getRequiredRouteSegments } from './route-segments.helpers';

export function findRelevantRoutes(
  shipment: AllocationShipment,
  routes: AllocationRoute[],
  routeStops: AllocationRouteStop[],
): AllocationRoute[] {
  return routes.filter((route) => {
    const segments = getRequiredRouteSegments(
      route.id,
      shipment,
      routeStops,
    );

    return segments !== null;
  });
}