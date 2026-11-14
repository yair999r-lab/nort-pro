import type {
  AllocationShipment,
  AllocationRouteStop,
} from '../types/allocation.types';

export interface RouteSegment {
  fromPortId: string;
  toPortId: string;
}

export function getRouteSegmentsBetweenPorts(
  routeId: string,
  fromPortId: string,
  toPortId: string,
  routeStops: AllocationRouteStop[],
): RouteSegment[] | null {
  const stops = routeStops
    .filter((stop) => stop.routeId === routeId)
    .sort((a, b) => a.stopOrder - b.stopOrder);

  const startIndex = stops.findIndex(
    (stop) => stop.portId === fromPortId,
  );

  const endIndex = stops.findIndex(
    (stop) => stop.portId === toPortId,
  );

  if (startIndex === -1 || endIndex === -1) {
    return null;
  }

  if (startIndex === endIndex) {
    return [];
  }

  const segments: RouteSegment[] = [];

  for (let i = 0; i < stops.length; i++) {
    const currentIndex = (startIndex + i) % stops.length;
    const nextIndex = (currentIndex + 1) % stops.length;

    segments.push({
      fromPortId: stops[currentIndex].portId,
      toPortId: stops[nextIndex].portId,
    });

    if (nextIndex === endIndex) {
      return segments;
    }
  }

  return null;
}

export function getRequiredRouteSegments(
  routeId: string,
  shipment: AllocationShipment,
  routeStops: AllocationRouteStop[],
): RouteSegment[] | null {
  if (shipment.originPortId === shipment.destinationPortId) {
    return null;
  }

  return getRouteSegmentsBetweenPorts(
    routeId,
    shipment.originPortId,
    shipment.destinationPortId,
    routeStops,
  );
}