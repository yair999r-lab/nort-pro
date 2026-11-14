import { RouteSegment } from './getRequiredRouteSegments';

export interface ScheduledSegment extends RouteSegment {
  departureAt: string;
  arrivalAt: string;
  carriesShipment: boolean;
}

export interface ShipTimeline {
  segments: ScheduledSegment[];
  arrivalAtOrigin: string;
  arrivalAtDestination: string;
}

import {
  Ship,
  Shipment,
  routeStops,
  portDistances,
} from './shippingMockData';

const HOUR_MS = 60 * 60 * 1000;
const HOME_PORT_STOP_HOURS = 24;

export function calculateShipTimeline(
  ship: Ship,
  shipment: Shipment
): ShipTimeline | null {

  const stops = routeStops
    .filter(stop => stop.routeId === ship.routeId)
    .sort((a, b) => a.stopOrder - b.stopOrder);

  const currentIndex = stops.findIndex(
    stop => stop.portId === ship.currentPortId
  );

  const originIndex = stops.findIndex(
    stop => stop.portId === shipment.originPortId
  );

  const destinationIndex = stops.findIndex(
    stop => stop.portId === shipment.destinationPortId
  );

  if (
    currentIndex === -1 ||
    originIndex === -1 ||
    destinationIndex === -1 ||
    originIndex === destinationIndex ||
    !Number.isFinite(ship.speedKnots) ||
    ship.speedKnots <= 0
  ) {
    return null;
  }

  let currentTime = Date.parse(ship.availableFrom);

  if (Number.isNaN(currentTime)) {
    return null;
  }

  let currentIndexInRoute = currentIndex;

  const segments: ScheduledSegment[] = [];

  function addNextSegment(
    carriesShipment: boolean,
    willContinue: boolean
  ): boolean {

    const nextIndex =
      (currentIndexInRoute + 1) % stops.length;

    const fromPortId = stops[currentIndexInRoute].portId;
    const toPortId = stops[nextIndex].portId;

    const distance = portDistances.find(
      item =>
        item.fromPortId === fromPortId &&
        item.toPortId === toPortId
    );

    if (
      !distance ||
      !Number.isFinite(distance.distanceNm) ||
      distance.distanceNm <= 0
    ) {
      return false;
    }

    const departureTime = currentTime;

    const travelHours = distance.distanceNm / ship.speedKnots;

    const arrivalTime =
      departureTime + travelHours * HOUR_MS;

    segments.push({
      fromPortId,
      toPortId,
      departureAt: new Date(departureTime).toISOString(),
      arrivalAt: new Date(arrivalTime).toISOString(),
      carriesShipment,
    });

    currentTime = arrivalTime;
    currentIndexInRoute = nextIndex;

    // עצירה של 24 שעות בהגעה לנמל הבית
    if (
      toPortId === ship.homePortId &&
      willContinue
    ) {
      currentTime += HOME_PORT_STOP_HOURS * HOUR_MS;
    }

    return true;
  }

  // חלק ראשון: הגעה לנמל המוצא ללא המשלוח
  for (let i = 0; currentIndexInRoute !== originIndex; i++) {

    if (i >= stops.length) {
      return null;
    }

    if (!addNextSegment(false, true)) {
      return null;
    }
  }

  const arrivalAtOrigin = new Date(currentTime).toISOString();

  // חלק שני: הפלגה עם המשלוח לנמל היעד
  for (let i = 0; currentIndexInRoute !== destinationIndex; i++) {

    if (i >= stops.length) {
      return null;
    }

    const nextIndex =
      (currentIndexInRoute + 1) % stops.length;

    const willContinue = nextIndex !== destinationIndex;

    if (!addNextSegment(true, willContinue)) {
      return null;
    }
  }

  return {
    segments,
    arrivalAtOrigin,
    arrivalAtDestination: new Date(currentTime).toISOString(),
  };
}