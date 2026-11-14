import type {
  AllocationVoyage,
  AllocationRouteVoyage,
} from '../types/allocation.types';

import type { RouteSegment } from './route-segments.helpers';

export function getExistingVoyagesForSegment(
  routeId: string,
  segment: RouteSegment,
  voyages: AllocationVoyage[],
  routeVoyages: AllocationRouteVoyage[],
): AllocationVoyage[] {
  const voyageIds = new Set(
    routeVoyages
      .filter((item) => item.routeId === routeId)
      .map((item) => item.voyageId),
  );

  return voyages
    .filter(
      (voyage) =>
        voyageIds.has(voyage.id) &&
        voyage.fromPortId === segment.fromPortId &&
        voyage.toPortId === segment.toPortId,
    )
    .sort(
      (a, b) =>
        Date.parse(a.departureAt) - Date.parse(b.departureAt),
    );
}