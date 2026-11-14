import { randomUUID } from 'crypto';

import { voyages } from '../data/shipping.mock';

import type {
  Ship,
  Shipment,
  Voyage,
  RouteVoyage,
  ShipmentVoyage,
} from '../data/shipping.mock';

import type { MatchedVoyage } from './match-schedule-with-existing-voyages.helpers';

export interface AllocationPlan {
  existingVoyageLoadUpdates: {
    voyageId: string;
    addedWeightKg: number;
  }[];

  newVoyages: Voyage[];

  newRouteVoyageLinks: RouteVoyage[];

  newShipmentVoyageLinks: ShipmentVoyage[];
}

export function buildAllocationPlan(
  ship: Ship,
  shipment: Shipment,
  matchedVoyages: MatchedVoyage[],
): AllocationPlan | null {
  const plan: AllocationPlan = {
    existingVoyageLoadUpdates: [],
    newVoyages: [],
    newRouteVoyageLinks: [],
    newShipmentVoyageLinks: [],
  };

  for (const matchedVoyage of matchedVoyages) {
    let voyageId: string;

    if (matchedVoyage.type === 'existing') {
      if (!matchedVoyage.voyageId) {
        return null;
      }

      const existingVoyage = voyages.find(
        (voyage) => voyage.id === matchedVoyage.voyageId,
      );

      if (
        !existingVoyage ||
        existingVoyage.shipId !== ship.id ||
        existingVoyage.fromPortId !== matchedVoyage.fromPortId ||
        existingVoyage.toPortId !== matchedVoyage.toPortId
      ) {
        return null;
      }

      voyageId = existingVoyage.id;

      // מעדכנים משקל רק אם המשלוח נמצא על האונייה
      if (matchedVoyage.carriesShipment) {
        plan.existingVoyageLoadUpdates.push({
          voyageId,
          addedWeightKg: shipment.weightKg,
        });
      }
    } else {
      // יצירת מזהה חדש להפלגה המתוכננת
      voyageId = randomUUID();

      const newVoyage: Voyage = {
        id: voyageId,
        shipId: ship.id,
        fromPortId: matchedVoyage.fromPortId,
        toPortId: matchedVoyage.toPortId,
        departureAt: matchedVoyage.departureAt,
        arrivalAt: matchedVoyage.arrivalAt,
        currentLoadWeightKg: matchedVoyage.carriesShipment
          ? shipment.weightKg
          : 0,
      };

      plan.newVoyages.push(newVoyage);

      // כל הפלגה חדשה משויכת למסלול
      plan.newRouteVoyageLinks.push({
        routeId: ship.routeId,
        voyageId,
      });
    }

    // מקשרים למשלוח רק הפלגות שנושאות אותו
    if (matchedVoyage.carriesShipment) {
      plan.newShipmentVoyageLinks.push({
        shipmentId: shipment.id,
        voyageId,
      });
    }
  }

  return plan;
}