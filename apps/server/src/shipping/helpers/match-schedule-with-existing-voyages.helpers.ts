import type {
  AllocationShip,
  AllocationShipment,
  AllocationVoyage,
  AllocationRouteVoyage,
} from '../types/allocation.types';

import type { ShipSchedule } from '../types/calculate.type';

import { getExistingVoyagesForSegment } from './get-existing-voyages-for-segment.helpers';
import { hasEnoughCapacity } from './has-enough-capacity.helpers';

export interface MatchedVoyage {
  type: 'existing' | 'new';
  voyageId?: string;
  fromPortId: string;
  toPortId: string;
  departureAt: string;
  arrivalAt: string;
  carriesShipment: boolean;
}

export function matchScheduleWithExistingVoyages(
  ship: AllocationShip,
  shipment: AllocationShipment,
  schedule: ShipSchedule,
  voyages: AllocationVoyage[],
  routeVoyages: AllocationRouteVoyage[],
): MatchedVoyage[] | null {
  const result: MatchedVoyage[] = [];

  for (const segment of schedule.segments) {
    const existingVoyage = getExistingVoyagesForSegment(
      ship.routeId,
      segment,
      voyages,
      routeVoyages,
    ).find(
      (voyage) =>
        voyage.shipId === ship.id &&
        Date.parse(voyage.departureAt) ===
          Date.parse(segment.departureAt),
    );

    if (existingVoyage) {
      if (
        segment.carriesShipment &&
        !hasEnoughCapacity(ship, shipment, [existingVoyage])
      ) {
        return null;
      }

      result.push({
        type: 'existing',
        voyageId: existingVoyage.id,
        fromPortId: existingVoyage.fromPortId,
        toPortId: existingVoyage.toPortId,
        departureAt: existingVoyage.departureAt,
        arrivalAt: existingVoyage.arrivalAt,
        carriesShipment: segment.carriesShipment,
      });
    } else {
      result.push({
        type: 'new',
        fromPortId: segment.fromPortId,
        toPortId: segment.toPortId,
        departureAt: segment.departureAt,
        arrivalAt: segment.arrivalAt,
        carriesShipment: segment.carriesShipment,
      });
    }
  }

  return result;
}