import { Ship, Shipment } from './shippingMockData';

import { ShipTimeline } from './calculateShipTimeline';
import { getExistingVoyagesForSegment } from './getExistingVoyagesForSegment';
import { hasEnoughCapacity } from './hasEnoughCapacity';

export interface MatchedVoyage {
  type: 'existing' | 'new';
  voyageId?: string;
  fromPortId: string;
  toPortId: string;
  departureAt: string;
  arrivalAt: string;
}

export function matchTimelineWithExistingVoyages(
  ship: Ship,
  shipment: Shipment,
  timeline: ShipTimeline,
): MatchedVoyage[] | null {
  const result: MatchedVoyage[] = [];

  for (const segment of timeline.segments.filter(
    (segment) => segment.carriesShipment,
  )) {
    const existingVoyage = getExistingVoyagesForSegment(
      ship.routeId,
      segment,
    ).find(
      (voyage) =>
        Date.parse(voyage.departureAt) === Date.parse(segment.departureAt),
    );

    if (existingVoyage) {
      if (!hasEnoughCapacity(ship, shipment, [existingVoyage])) {
        return null;
      }

      result.push({
        type: 'existing',
        voyageId: existingVoyage.id,
        fromPortId: existingVoyage.fromPortId,
        toPortId: existingVoyage.toPortId,
        departureAt: existingVoyage.departureAt,
        arrivalAt: existingVoyage.arrivalAt,
      });
    } else {
      result.push({
        type: 'new',
        fromPortId: segment.fromPortId,
        toPortId: segment.toPortId,
        departureAt: segment.departureAt,
        arrivalAt: segment.arrivalAt,
      });
    }
  }

  return result;
}
