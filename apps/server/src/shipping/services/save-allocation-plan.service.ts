import {
  insertVoyageDAL,
  increaseVoyageLoadDAL,
} from '../../voyages/dal/voyages.dal';

import { insertRouteVoyageDAL } from '../../route-voyages/dal/route-voyages.dal';

import { insertShipmentVoyagesDAL } from '../../shipment-voyages/dal/shipment-voyages.dal';

import { allocateShipmentDAL } from '../../shipments/dal/shipments.dal';

import type { AllocationPlan } from '../helpers/build-database-allocation-plan.helpers';

interface SaveAllocationPlanInput {
  shipmentId: number;
  routeId: number;
  plan: AllocationPlan;
}

export const saveAllocationPlanToDatabase = async ({
  shipmentId,
  routeId,
  plan,
}: SaveAllocationPlanInput): Promise<number[]> => {
  // 1. יצירת הפלגות חדשות ושמירת המזהים שהתקבלו מה-DB
  const createdVoyageIds: number[] = [];

  for (const voyage of plan.newVoyages) {
    const voyageId = await insertVoyageDAL({
      ship_id: voyage.shipId,
      origin_port_id: voyage.originPortId,
      destination_port_id: voyage.destinationPortId,
      distance_nm: voyage.distanceNm,
      departure_date: voyage.departureAt,
      estimated_arrival: voyage.arrivalAt,
      current_load_weight_kg: voyage.currentLoadWeightKg,
    });

    if (voyageId === null) {
      throw new Error('Failed to create a new voyage');
    }

    createdVoyageIds.push(voyageId);
  }

  // 2. קישור ההפלגות החדשות למסלול
  for (const link of plan.newRouteVoyageLinks) {
    const voyageId = createdVoyageIds[link.newVoyageIndex];

    if (voyageId === undefined) {
      throw new Error('New voyage ID was not found');
    }

    const inserted = await insertRouteVoyageDAL({
      route_id: link.routeId,
      voyage_id: voyageId,
      segment_order: link.segmentOrder,
    });

    if (!inserted) {
      throw new Error('Failed to link voyage to route');
    }
  }

  // 3. עדכון המשקל בהפלגות קיימות
  for (const update of plan.existingVoyageLoadUpdates) {
    const updated = await increaseVoyageLoadDAL(
      update.voyageId,
      update.addedWeightKg,
    );

    if (!updated) {
      throw new Error('Failed to update existing voyage load');
    }
  }

  // 4. יצירת הקישורים בין המשלוח להפלגות
  const shipmentLinks = plan.shipmentVoyageLinks.map((link, index) => {
    const voyageId =
      'existingVoyageId' in link
        ? link.existingVoyageId
        : createdVoyageIds[link.newVoyageIndex];

    if (voyageId === undefined) {
      throw new Error('Shipment voyage link has an invalid voyage ID');
    }

    return {
      shipment_id: shipmentId,
      route_id: routeId,
      voyage_id: voyageId,
      leg_order: index + 1,
    };
  });

  const insertedLinks = await insertShipmentVoyagesDAL(shipmentLinks);

  if (insertedLinks.length !== shipmentLinks.length) {
    throw new Error('Failed to create all shipment voyage links');
  }

  // 5. עדכון סטטוס המשלוח - הפעולה האחרונה
  const allocated = await allocateShipmentDAL(shipmentId, routeId);

  if (!allocated) {
    throw new Error('Failed to update shipment status');
  }

  return createdVoyageIds;
};
