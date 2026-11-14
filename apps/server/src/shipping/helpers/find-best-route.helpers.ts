import type {
  AllocationShip,
  AllocationShipment,
} from '../types/allocation.types';

import type { RoutePlanningConstraints } from '../types/route-planner.types';

import type {
  RoutePlan,
  PlannedRouteStop,
  RoutePlanLeg,
} from '../types/route-planner.types';

import { buildShipmentRouteActions } from './build-shipment-route-actions.helpers';
import { getPortDistance } from './build-port-distance-map.helpers';
import { hasEnoughFuel } from './has-enough-fuel.helpers';
import { calculateMaxSailingHours } from './calculate-max-sailing-hours.helpers';

const HOUR_MS = 60 * 60 * 1000;

interface SearchState {
  portId: string;
  time: number;
  distance: number;
  loadKg: number;
  completed: Set<string>;
  picked: Set<string>;
  stops: PlannedRouteStop[];
  legs: RoutePlanLeg[];
  distances: number[];
  onboard: Set<string>;
}

const actionKey = (shipmentId: string, action: string) =>
  `${shipmentId}:${action}`;

export const findBestRoute = (
  ship: AllocationShip,
  shipments: AllocationShipment[],
  distanceMap: Map<string, number>,
  constraints: RoutePlanningConstraints,
): RoutePlan | null => {
  if (shipments.length === 0 || ship.speedKnots <= 0 || ship.capacityKg <= 0) {
    return null;
  }

  const maxHours = calculateMaxSailingHours(ship);
  const startTime = Date.parse(constraints.plannedDepartureAt);
  const returnDeadline = Date.parse(constraints.returnDeadlineAt);
  const actions = buildShipmentRouteActions(shipments);

  if (
    maxHours === null ||
    Number.isNaN(startTime) ||
    !actions ||
    Number.isNaN(returnDeadline)
  ) {
    return null;
  }

  const shipmentMap = new Map(
    shipments.map((shipment) => [shipment.id, shipment]),
  );

  let bestRoute: RoutePlan | null = null;

  const search = (state: SearchState): void => {
    if (bestRoute && state.distance >= bestRoute.totalDistanceNm) {
      return;
    }

    // All pickups and deliveries completed: return home
    if (state.completed.size === actions.length) {
      const returnDistance = getPortDistance(
        distanceMap,
        state.portId,
        ship.homePortId,
      );

      if (returnDistance === null) return;

      const returnHours = returnDistance / ship.speedKnots;
      const returnTime = state.time + returnHours * HOUR_MS;
      const totalDistance = state.distance + returnDistance;
      const totalHours = (returnTime - startTime) / HOUR_MS;

      const distances = [
        ...state.distances,
        ...(returnDistance > 0 ? [returnDistance] : []),
      ];

      if (
        totalHours > maxHours ||
        returnTime > returnDeadline ||
        !hasEnoughFuel(ship, distances)
      ) {
        return;
      }

      const stops = [...state.stops];

      if (stops[stops.length - 1].portId !== ship.homePortId) {
        stops.push({
          portId: ship.homePortId,
          pickups: [],
          deliveries: [],
        });
      }

      const legs = [...state.legs];

      if (returnDistance > 0) {
        legs.push({
          fromPortId: state.portId,
          toPortId: ship.homePortId,
          distanceNm: returnDistance,
          departureAt: new Date(state.time).toISOString(),
          arrivalAt: new Date(returnTime).toISOString(),
          loadWeightKg: state.loadKg,
          shipmentIds: [...state.onboard],
        });
      }

      bestRoute = {
        shipId: ship.id,
        stops,
        legs,
        totalDistanceNm: totalDistance,
        estimatedReturnAt: new Date(returnTime).toISOString(),
        plannedDepartureAt: constraints.plannedDepartureAt,
        returnDeadlineAt: constraints.returnDeadlineAt,
      };

      return;
    }

    for (const action of actions) {
      const key = actionKey(action.shipmentId, action.action);

      if (state.completed.has(key)) continue;

      if (
        action.action === 'delivery' &&
        !state.picked.has(action.shipmentId)
      ) {
        continue;
      }

      if (
        action.action === 'pickup' &&
        state.loadKg + action.weightKg > ship.capacityKg
      ) {
        continue;
      }

      const distance = getPortDistance(
        distanceMap,
        state.portId,
        action.portId,
      );

      if (distance === null) continue;

      const travelHours = distance / ship.speedKnots;
      const arrivalTime = state.time + travelHours * HOUR_MS;
      const elapsedHours = (arrivalTime - startTime) / HOUR_MS;

      if (elapsedHours > maxHours) continue;

      const shipment = shipmentMap.get(action.shipmentId);

      if (!shipment) continue;

      if (action.action === 'delivery' && shipment.requiredArrival) {
        const deadline = Date.parse(shipment.requiredArrival);

        if (Number.isNaN(deadline) || arrivalTime > deadline) {
          continue;
        }
      }

      const nextLoad =
        state.loadKg +
        (action.action === 'pickup' ? action.weightKg : -action.weightKg);

      if (nextLoad < 0) continue;

      const nextDistances = [
        ...state.distances,
        ...(distance > 0 ? [distance] : []),
      ];

      if (nextDistances.length > 0 && !hasEnoughFuel(ship, nextDistances)) {
        continue;
      }

      const stops = state.stops.map((stop) => ({
        ...stop,
        pickups: [...stop.pickups],
        deliveries: [...stop.deliveries],
      }));

      let currentStop = stops[stops.length - 1];

      if (currentStop.portId !== action.portId) {
        currentStop = {
          portId: action.portId,
          pickups: [],
          deliveries: [],
        };
        stops.push(currentStop);
      }

      if (action.action === 'pickup') {
        currentStop.pickups.push(action.shipmentId);
      } else {
        currentStop.deliveries.push(action.shipmentId);
      }

      const legs = [...state.legs];

      if (distance > 0) {
        legs.push({
          fromPortId: state.portId,
          toPortId: action.portId,
          distanceNm: distance,
          departureAt: new Date(state.time).toISOString(),
          arrivalAt: new Date(arrivalTime).toISOString(),
          loadWeightKg: state.loadKg,
          shipmentIds: [...state.onboard],
        });
      }

      const completed = new Set(state.completed);
      completed.add(key);

      const picked = new Set(state.picked);

      if (action.action === 'pickup') {
        picked.add(action.shipmentId);
      }

      const onboard = new Set(state.onboard);

      if (action.action === 'pickup') {
        onboard.add(action.shipmentId);
      } else {
        onboard.delete(action.shipmentId);
      }

      search({
        portId: action.portId,
        time: arrivalTime,
        distance: state.distance + distance,
        loadKg: nextLoad,
        completed,
        picked,
        stops,
        legs,
        distances: nextDistances,
        onboard,
      });
    }
  };

  search({
    portId: ship.currentPortId,
    time: startTime,
    distance: 0,
    loadKg: 0,
    completed: new Set(),
    picked: new Set(),
    stops: [
      {
        portId: ship.currentPortId,
        pickups: [],
        deliveries: [],
      },
    ],
    legs: [],
    distances: [],
    onboard: new Set(),
  });

  return bestRoute;
};
