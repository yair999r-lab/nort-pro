import type {
  AllocationShip,
  AllocationShipment,
  AllocationRouteStop,
  AllocationPortDistance,
} from '../types/allocation.types';

import type { ShipSchedule, ScheduledSegment } from '../types/calculate.type';

import {
  getRouteSegmentsBetweenPorts,
  type RouteSegment,
} from './route-segments.helpers';

import { calculateSegmentsDistance } from './calculate-segments-distance.helpers';
import { calculateTravelTime } from './calculate-travel-time.helpers';

const HOUR_MS = 60 * 60 * 1000;
const HOME_PORT_STOP_HOURS = 24;

export function calculateShipSchedule(
  ship: AllocationShip,
  shipment: AllocationShipment,
  routeStops: AllocationRouteStop[],
  portDistances: AllocationPortDistance[],
  plannedDepartureAt: string,
): ShipSchedule | null {
  if (shipment.originPortId === shipment.destinationPortId) {
    return null;
  }

  const repositionSegments = getRouteSegmentsBetweenPorts(
    ship.routeId,
    ship.currentPortId,
    shipment.originPortId,
    routeStops,
  );

  if (!repositionSegments) {
    return null;
  }

  const shipmentSegments = getRouteSegmentsBetweenPorts(
    ship.routeId,
    shipment.originPortId,
    shipment.destinationPortId,
    routeStops,
  );

  if (!shipmentSegments) {
    return null;
  }

  const repositionDistance = calculateSegmentsDistance(
    repositionSegments,
    portDistances,
  );

  if (repositionDistance === null) {
    return null;
  }

  const shipmentDistance = calculateSegmentsDistance(
    shipmentSegments,
    portDistances,
  );

  if (shipmentDistance === null) {
    return null;
  }

  const startTime = Date.parse(plannedDepartureAt);

  if (!Number.isFinite(startTime)) {
    return null;
  }

  let currentTime = startTime;

  const scheduledSegments: ScheduledSegment[] = [];
  let totalHomePortStops = 0;

  const scheduleSegments = (
    segments: RouteSegment[],
    carriesShipment: boolean,
  ): boolean => {
    for (const segment of segments) {
      if (
        scheduledSegments.length > 0 &&
        segment.fromPortId === ship.homePortId
      ) {
        currentTime += HOME_PORT_STOP_HOURS * HOUR_MS;
        totalHomePortStops++;
      }

      const segmentDistance = calculateSegmentsDistance(
        [segment],
        portDistances,
      );

      if (segmentDistance === null) {
        return false;
      }

      const travelHours = calculateTravelTime(segmentDistance, ship.speedKnots);

      if (travelHours === null) {
        return false;
      }

      const departureTime = currentTime;
      const arrivalTime = departureTime + travelHours * HOUR_MS;

      scheduledSegments.push({
        fromPortId: segment.fromPortId,
        toPortId: segment.toPortId,
        departureAt: new Date(departureTime).toISOString(),
        arrivalAt: new Date(arrivalTime).toISOString(),
        carriesShipment,
      });

      currentTime = arrivalTime;
    }

    return true;
  };

  if (!scheduleSegments(repositionSegments, false)) {
    return null;
  }

  const arrivalAtOrigin = new Date(currentTime).toISOString();

  if (!scheduleSegments(shipmentSegments, true)) {
    return null;
  }

  const arrivalAtDestination = new Date(currentTime).toISOString();

  return {
    segments: scheduledSegments,
    arrivalAtOrigin,
    arrivalAtDestination,
    repositionDistanceNm: repositionDistance,
    shipmentDistanceNm: shipmentDistance,
    totalDistanceNm: repositionDistance + shipmentDistance,
    totalHomePortStops,
  };
}
