import { Shipment } from './shippingMockData';

import { findRelevantRoutes } from './findRelevantRoutes';
import { getShipForRoute } from './getShipForRoute';
import { hasEnoughCapacity } from './hasEnoughCapacity';
import { calculateShipTimeline } from './calculateShipTimeline';
import { isArrivalOnTime } from './isArrivalOnTime';
import {
  matchTimelineWithExistingVoyages,
  MatchedVoyage,
} from './matchTimelineWithExistingVoyages';

export interface AllocationOption {
  routeId: string;
  shipId: string;
  shipName: string;
  arrivalAtOrigin: string;
  arrivalAtDestination: string;
  voyages: MatchedVoyage[];
}

export function buildAllocationOptions(
  shipment: Shipment
): AllocationOption[] {

  const relevantRoutes = findRelevantRoutes(shipment);

  const options: AllocationOption[] = [];

  for (const route of relevantRoutes) {

    const ship = getShipForRoute(route.id);

    if (!ship || ship.status !== 'active') {
      continue;
    }

    if (!hasEnoughCapacity(ship, shipment, [])) {
      continue;
    }

    const timeline = calculateShipTimeline(ship, shipment);

    if (!timeline) {
      continue;
    }

    const voyages = matchTimelineWithExistingVoyages(
      ship,
      shipment,
      timeline
    );

    if (!voyages || voyages.length === 0) {
      continue;
    }

    const arrivalAtDestination =
      voyages[voyages.length - 1].arrivalAt;

    if (
      !isArrivalOnTime(
        arrivalAtDestination,
        shipment.requiredArrival
      )
    ) {
      continue;
    }

    options.push({
      routeId: route.id,
      shipId: ship.id,
      shipName: ship.name,
      arrivalAtOrigin: timeline.arrivalAtOrigin,
      arrivalAtDestination,
      voyages,
    });
  }

  return options;
}