import { portDistances } from './shippingMockData';
import { RouteSegment } from './getRequiredRouteSegments';

export function calculateSegmentsDistance(
  segments: RouteSegment[]
): number | null {

  let totalDistanceNm = 0;

  for (const segment of segments) {

    const distance = portDistances.find(
      item =>
        item.fromPortId === segment.fromPortId &&
        item.toPortId === segment.toPortId
    );

    if (
      !distance ||
      !Number.isFinite(distance.distanceNm) ||
      distance.distanceNm <= 0
    ) {
      return null;
    }

    totalDistanceNm += distance.distanceNm;
  }

  return totalDistanceNm;
}