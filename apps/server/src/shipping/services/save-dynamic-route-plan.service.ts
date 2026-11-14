import type { AllocationShip } from '../types/allocation.types';

import type { RoutePlan } from '../types/route-planner.types';

import {
  insertDynamicRoutePlanDAL,
  activateDynamicRoutePlanDAL,
} from '../../routes/dal/routes.dal';
import { insertDynamicRouteStopsDAL } from '../../route-stops/dal/route-stops.dal';
import { insertVoyageDAL } from '../../voyages/dal/voyages.dal';
import { insertRouteVoyageDAL } from '../../route-voyages/dal/route-voyages.dal';
import { insertShipmentVoyagesDAL } from '../../shipment-voyages/dal/shipment-voyages.dal';
import { assignShipmentsToRouteDAL } from '../../shipments/dal/shipments.dal';

interface SaveDynamicRoutePlanInput {
  ship: AllocationShip;
  plan: RoutePlan;
}

export const saveDynamicRoutePlan = async ({
  ship,
  plan,
}: SaveDynamicRoutePlanInput) => {
  if (
    plan.shipId !== ship.id ||
    plan.stops.length < 2 ||
    plan.legs.length !== plan.stops.length - 1
  ) {
    throw new Error('Invalid route plan structure');
  }

  const shipmentIds = [...new Set(plan.legs.flatMap((leg) => leg.shipmentIds))];

  if (shipmentIds.length === 0) {
    throw new Error('Route plan contains no shipments');
  }

  // 1. Create the new route as inactive
  const route = await insertDynamicRoutePlanDAL({
    route_name: `Route - ${ship.name}`,
    start_port_id: Number(plan.stops[0].portId),
    end_port_id: Number(ship.homePortId),
    total_length_nm: plan.totalDistanceNm,
    ship_id: Number(ship.id),
    planned_departure_at: plan.plannedDepartureAt,
    return_deadline_at: plan.returnDeadlineAt,
    estimated_return_at: plan.estimatedReturnAt,
  });

  if (!route) {
    throw new Error('Failed to create dynamic route');
  }

  const routeId = route.route_id;

  // 2. Save ordered route stops
  const stopsInserted = await insertDynamicRouteStopsDAL(
    plan.stops.map((stop, index) => ({
      route_id: routeId,
      port_id: Number(stop.portId),
      stop_order: index + 1,
      planned_arrival_at: index > 0 ? plan.legs[index - 1].arrivalAt : null,
      planned_departure_at:
        index < plan.legs.length ? plan.legs[index].departureAt : null,
    })),
  );

  if (!stopsInserted) {
    throw new Error('Failed to save route stops');
  }

  // 3. Create voyages and link them to the route
  const createdVoyageIds: number[] = [];
  const shipmentLinks: {
    shipment_id: number;
    route_id: number;
    voyage_id: number;
    leg_order: number;
  }[] = [];

  const shipmentLegOrders = new Map<string, number>();

  for (let index = 0; index < plan.legs.length; index++) {
    const leg = plan.legs[index];

    const voyageId = await insertVoyageDAL({
      ship_id: Number(ship.id),
      origin_port_id: Number(leg.fromPortId),
      destination_port_id: Number(leg.toPortId),
      distance_nm: leg.distanceNm,
      departure_date: leg.departureAt,
      estimated_arrival: leg.arrivalAt,
      current_load_weight_kg: leg.loadWeightKg,
    });

    if (voyageId === null) {
      throw new Error('Failed to create voyage');
    }

    createdVoyageIds.push(voyageId);

    const linked = await insertRouteVoyageDAL({
      route_id: routeId,
      voyage_id: voyageId,
      segment_order: index + 1,
    });

    if (!linked) {
      throw new Error('Failed to link voyage to route');
    }

    // 4. Link every shipment carried on this voyage
    for (const shipmentId of new Set(leg.shipmentIds)) {
      const legOrder = (shipmentLegOrders.get(shipmentId) ?? 0) + 1;
      shipmentLegOrders.set(shipmentId, legOrder);

      shipmentLinks.push({
        shipment_id: Number(shipmentId),
        route_id: routeId,
        voyage_id: voyageId,
        leg_order: legOrder,
      });
    }
  }

  // 5. Save shipment-voyage relationships
  const insertedLinks = await insertShipmentVoyagesDAL(shipmentLinks);

  if (insertedLinks.length !== shipmentLinks.length) {
    throw new Error('Failed to save all shipment-voyage links');
  }

  // 6. Update all shipments to the new route
  const assigned = await assignShipmentsToRouteDAL(
    routeId,
    shipmentIds.map(Number),
  );

  if (!assigned) {
    throw new Error('Failed to assign shipments to new route');
  }

  // 7. Activate the new route only after all writes succeeded
  const activated = await activateDynamicRoutePlanDAL(Number(ship.id), routeId);

  if (!activated) {
    throw new Error('Failed to activate new route');
  }

  return {
    routeId,
    planVersion: route.plan_version,
    createdVoyageIds,
    shipmentIds,
  };
};
