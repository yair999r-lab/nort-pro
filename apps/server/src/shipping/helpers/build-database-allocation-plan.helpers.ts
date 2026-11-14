import type {
  AllocationShip,
  AllocationShipment,
  AllocationVoyage,
  AllocationRouteStop,
  AllocationPortDistance,
  AllocationRouteVoyage,
} from '../types/allocation.types';

import type { MatchedVoyage } from './match-schedule-with-existing-voyages.helpers';

export interface PlannedNewVoyage {
  shipId: number;
  originPortId: number;
  destinationPortId: number;
  distanceNm: number;
  departureAt: string;
  arrivalAt: string;
  currentLoadWeightKg: number;
}

export interface AllocationPlan {
  existingVoyageLoadUpdates: {
    voyageId: number;
    addedWeightKg: number;
  }[];

  newVoyages: PlannedNewVoyage[];

  newRouteVoyageLinks: {
    routeId: number;
    segmentOrder: number;
    newVoyageIndex: number;
  }[];

  shipmentVoyageLinks: (
    | {
        existingVoyageId: number;
      }
    | {
        newVoyageIndex: number;
      }
  )[];
}

function getSegmentOrder(
  routeId: string,
  fromPortId: string,
  toPortId: string,
  routeStops: AllocationRouteStop[],
): number | null {
  const stops = routeStops
    .filter((stop) => stop.routeId === routeId)
    .sort((a, b) => a.stopOrder - b.stopOrder);

  const currentIndex = stops.findIndex((stop) => stop.portId === fromPortId);

  if (currentIndex === -1 || stops.length < 2) {
    return null;
  }

  const nextIndex = (currentIndex + 1) % stops.length;

  if (stops[nextIndex].portId !== toPortId) {
    return null;
  }

  return stops[currentIndex].stopOrder;
}

export function buildAllocationPlan(
  ship: AllocationShip,
  shipment: AllocationShipment,
  matchedVoyages: MatchedVoyage[],
  voyages: AllocationVoyage[],
  routeStops: AllocationRouteStop[],
  portDistances: AllocationPortDistance[],
  routeVoyages: AllocationRouteVoyage[],
): AllocationPlan | null {
  const plan: AllocationPlan = {
    existingVoyageLoadUpdates: [],
    newVoyages: [],
    newRouteVoyageLinks: [],
    shipmentVoyageLinks: [],
  };

  if (
    !Number.isFinite(shipment.weightKg) ||
    shipment.weightKg <= 0 ||
    matchedVoyages.length === 0
  ) {
    return null;
  }

  for (const matched of matchedVoyages) {
    const segmentOrder = getSegmentOrder(
      ship.routeId,
      matched.fromPortId,
      matched.toPortId,
      routeStops,
    );

    if (segmentOrder === null) {
      return null;
    }

    if (matched.type === 'existing') {
      if (!matched.voyageId) {
        return null;
      }

      const voyage = voyages.find((item) => item.id === matched.voyageId);

      const routeLink = routeVoyages.find(
        (item) =>
          item.routeId === ship.routeId &&
          item.voyageId === matched.voyageId &&
          item.segmentOrder === segmentOrder,
      );

      if (!voyage || !routeLink || voyage.shipId !== ship.id) {
        return null;
      }

      if (matched.carriesShipment) {
        if (voyage.currentLoadWeightKg + shipment.weightKg > ship.capacityKg) {
          return null;
        }

        plan.existingVoyageLoadUpdates.push({
          voyageId: Number(voyage.id),
          addedWeightKg: shipment.weightKg,
        });

        plan.shipmentVoyageLinks.push({
          existingVoyageId: Number(voyage.id),
        });
      }
    } else {
      const distance = portDistances.find(
        (item) =>
          item.fromPortId === matched.fromPortId &&
          item.toPortId === matched.toPortId,
      );

      if (!distance || distance.distanceNm <= 0) {
        return null;
      }

      const newVoyageIndex = plan.newVoyages.length;

      plan.newVoyages.push({
        shipId: Number(ship.id),
        originPortId: Number(matched.fromPortId),
        destinationPortId: Number(matched.toPortId),
        distanceNm: distance.distanceNm,
        departureAt: matched.departureAt,
        arrivalAt: matched.arrivalAt,
        currentLoadWeightKg: matched.carriesShipment ? shipment.weightKg : 0,
      });

      plan.newRouteVoyageLinks.push({
        routeId: Number(ship.routeId),
        segmentOrder,
        newVoyageIndex,
      });

      if (matched.carriesShipment) {
        plan.shipmentVoyageLinks.push({
          newVoyageIndex,
        });
      }
    }
  }

  if (plan.shipmentVoyageLinks.length === 0) {
    return null;
  }

  return plan;
}
