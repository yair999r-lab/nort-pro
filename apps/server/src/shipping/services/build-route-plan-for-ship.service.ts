import type {
  AllocationContext,
  AllocationShip,
  AllocationShipment,
} from '../types/allocation.types';

import type {
  RoutePlan,
  RoutePlanningConstraints,
} from '../types/route-planner.types';

import { getShipmentsAssignedToShip } from '../helpers/get-shipments-assigned-to-ship.helpers';
import { buildPortDistanceMatrix } from './build-port-distance-matrix.service';
import { findBestRoute } from '../helpers/find-best-route.helpers';
import { calculateMaxSailingHours } from '../helpers/calculate-max-sailing-hours.helpers';

const HOUR_MS = 60 * 60 * 1000;

interface BuildRoutePlanInput {
  ship: AllocationShip;
  candidateShipment: AllocationShipment;
  data: AllocationContext;
}

export const buildRoutePlanForShip = async ({
  ship,
  candidateShipment,
  data,
}: BuildRoutePlanInput): Promise<RoutePlan | null> => {
  if (ship.status !== 'active') return null;

 const maxSailingHours = calculateMaxSailingHours(ship);

const shipRoute = data.routes.find(
  (route) =>
    route.id === ship.routeId &&
    route.routeKind === 'legacy_template' &&
    route.status === 'active',
);

if (
  maxSailingHours === null ||
  !shipRoute?.plannedDepartureAt ||
  !shipRoute.returnDeadlineAt
) {
  return null;
}

const departureTime = Date.parse(shipRoute.plannedDepartureAt);
const routeDeadline = Date.parse(shipRoute.returnDeadlineAt);

if (
  !Number.isFinite(departureTime) ||
  !Number.isFinite(routeDeadline) ||
  routeDeadline <= departureTime
) {
  return null;
}

const fuelDeadline = departureTime + maxSailingHours * HOUR_MS;

const effectiveDeadline = Math.min(
  routeDeadline,
  fuelDeadline,
);

const constraints: RoutePlanningConstraints = {
  plannedDepartureAt: new Date(departureTime).toISOString(),
  returnDeadlineAt: new Date(effectiveDeadline).toISOString(),
};

  const assignedShipments = getShipmentsAssignedToShip(
    ship.id,
    data,
  );

  const shipmentMap = new Map<string, AllocationShipment>();

  for (const shipment of [...assignedShipments, candidateShipment]) {
    shipmentMap.set(shipment.id, shipment);
  }

  const shipments = [...shipmentMap.values()];

  const portIds = [
    ship.currentPortId,
    ship.homePortId,
    ...shipments.flatMap((shipment) => [
      shipment.originPortId,
      shipment.destinationPortId,
    ]),
  ];

  const distanceMap = await buildPortDistanceMatrix(
    portIds,
    data.portDistances,
  );

  return findBestRoute(
    ship,
    shipments,
    distanceMap,
    constraints,
  );
};