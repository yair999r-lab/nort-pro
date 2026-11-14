import { Ship, Shipment } from './shippingMockData';

import {
  getRouteSegmentsBetweenPorts,
  RouteSegment,
} from './getRequiredRouteSegments';

import { calculateSegmentsDistance } from './calculateRouteDistance';
import { calculateTravelTime } from './calculateTravelTime';

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

// סופרת כמה פעמים הספינה יוצאת מנמל הבית
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
  ship: Ship,
  shipment: Shipment,
  plannedDepartureAt: string,
): EstimatedArrival | null {
  // נסיעה ראשונה: מהמיקום הנוכחי לנמל המוצא
  const repositionSegments = getRouteSegmentsBetweenPorts(
    ship.routeId,
    ship.currentPortId,
    shipment.originPortId,
  );

  if (!repositionSegments) {
    return null;
  }

  // נסיעה שנייה: מנמל המוצא לנמל היעד
  const shipmentSegments = getRouteSegmentsBetweenPorts(
    ship.routeId,
    shipment.originPortId,
    shipment.destinationPortId,
  );

  if (!shipmentSegments) {
    return null;
  }

  const repositionDistance = calculateSegmentsDistance(repositionSegments);

  if (repositionDistance === null) return null;

  const shipmentDistance = calculateSegmentsDistance(shipmentSegments);

  if (shipmentDistance === null) return null;

  const repositionHours = calculateTravelTime(
    repositionDistance,
    ship.speedKnots,
  );

  if (repositionHours === null) return null;

  const shipmentHours = calculateTravelTime(shipmentDistance, ship.speedKnots);

  if (shipmentHours === null) return null;

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

  // חישוב מועדי ההגעה לפי מועד היציאה מהמסלול
  const startTime = Date.parse(plannedDepartureAt);

  if (!Number.isFinite(startTime)) {
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
