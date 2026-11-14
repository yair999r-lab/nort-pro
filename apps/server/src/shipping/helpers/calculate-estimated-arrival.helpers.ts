import type {
  AllocationShip,
  AllocationShipment,
  AllocationRouteStop,
  AllocationPortDistance,
} from '../types/allocation.types';

import {
  getRouteSegmentsBetweenPorts,
  type RouteSegment,
} from './route-segments.helpers';

import { calculateSegmentsDistance } from './calculate-segments-distance.helpers';
import { calculateTravelTime } from './calculate-travel-time.helpers';

const HOUR_MS = 60 * 60 * 1000;
const HOME_PORT_STOP_HOURS = 24;

export interface EstimatedArrival {
  arrivalAtOrigin: string;
  arrivalAtDestination: string;
  repositionDistanceNm: number;
  shipmentDistanceNm: number;
  totalDistanceNm: number;
  totalHomePortStops: number;
}

function countHomePortStops(
  segments: RouteSegment[],
  homePortId: string,
  skipFirstDeparture: boolean,
): number {
  return segments.filter((segment, index) => {
    if (skipFirstDeparture && index === 0) {
      return false;
    }

    return segment.fromPortId === homePortId;
  }).length;
}

export function calculateEstimatedArrival(
  ship: AllocationShip,
  shipment: AllocationShipment,
  routeStops: AllocationRouteStop[],
  portDistances: AllocationPortDistance[],
  plannedDepartureAt: string,
): EstimatedArrival | null {
  // נסיעה ראשונה: מהמיקום הנוכחי לנמל המוצא
  const repositionSegments = getRouteSegmentsBetweenPorts(
    ship.routeId,
    ship.currentPortId,
    shipment.originPortId,
    routeStops,
  );

  if (!repositionSegments) {
    return null;
  }

  // נסיעה שנייה: מנמל המוצא לנמל היעד
  const shipmentSegments = getRouteSegmentsBetweenPorts(
    ship.routeId,
    shipment.originPortId,
    shipment.destinationPortId,
    routeStops,
  );

  if (!shipmentSegments) {
    return null;
  }

  // חישוב מרחק הנסיעה הראשונה
  const repositionDistance = calculateSegmentsDistance(
    repositionSegments,
    portDistances,
  );

  if (repositionDistance === null) {
    return null;
  }

  // חישוב מרחק הנסיעה השנייה
  const shipmentDistance = calculateSegmentsDistance(
    shipmentSegments,
    portDistances,
  );

  if (shipmentDistance === null) {
    return null;
  }

  const repositionHours = calculateTravelTime(
    repositionDistance,
    ship.speedKnots,
  );

  if (repositionHours === null) {
    return null;
  }

  const shipmentHours = calculateTravelTime(shipmentDistance, ship.speedKnots);

  if (shipmentHours === null) {
    return null;
  }

  // בדיקת עצירות בנמל הבית
  const startsAtHome = ship.currentPortId === ship.homePortId;

  const repositionStops = countHomePortStops(
    repositionSegments,
    ship.homePortId,
    startsAtHome,
  );

  const shipmentStops = countHomePortStops(
    shipmentSegments,
    ship.homePortId,
    startsAtHome && repositionSegments.length === 0,
  );

  const totalHomePortStops = repositionStops + shipmentStops;

  // חישוב מועדי ההגעה
  const startTime = Date.parse(plannedDepartureAt);

  if (Number.isNaN(startTime)) {
    return null;
  }

  const arrivalAtOrigin =
    startTime +
    (repositionHours + repositionStops * HOME_PORT_STOP_HOURS) * HOUR_MS;

  const arrivalAtDestination =
    arrivalAtOrigin +
    (shipmentHours + shipmentStops * HOME_PORT_STOP_HOURS) * HOUR_MS;

  return {
    arrivalAtOrigin: new Date(arrivalAtOrigin).toISOString(),
    arrivalAtDestination: new Date(arrivalAtDestination).toISOString(),
    repositionDistanceNm: repositionDistance,
    shipmentDistanceNm: shipmentDistance,
    totalDistanceNm: repositionDistance + shipmentDistance,
    totalHomePortStops,
  };
}
