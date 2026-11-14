import type {
  AllocationPortDistance,
} from '../types/allocation.types';

import type { RouteSegment } from './route-segments.helpers';

export function calculateSegmentsDistance(
  segments: RouteSegment[],
  portDistances: AllocationPortDistance[],
): number | null {
  let totalDistanceNm = 0;

  for (const segment of segments) {
    const distance = portDistances.find(
      (item) =>
        item.fromPortId === segment.fromPortId &&
        item.toPortId === segment.toPortId,
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