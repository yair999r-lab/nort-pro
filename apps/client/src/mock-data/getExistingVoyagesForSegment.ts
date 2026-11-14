import { voyages, routeVoyages, Voyage } from './shippingMockData';
import { RouteSegment } from './getRequiredRouteSegments';

export function getExistingVoyagesForSegment(
  routeId: string,
  segment: RouteSegment
): Voyage[] {

  const voyageIds = new Set(
    routeVoyages
      .filter(item => item.routeId === routeId)
      .map(item => item.voyageId)
  );

  return voyages
    .filter(voyage =>
      voyageIds.has(voyage.id) &&
      voyage.fromPortId === segment.fromPortId &&
      voyage.toPortId === segment.toPortId
    )
    .sort(
      (a, b) =>
        Date.parse(a.departureAt) - Date.parse(b.departureAt)
    );
}