import type {
  AllocationShip,
} from '../types/allocation.types';

import type {
  PlannedRouteStop,
} from '../types/route-planner.types';

import { getPortDistance } from './build-port-distance-map.helpers';
import { hasEnoughFuel } from './has-enough-fuel.helpers';

export const validateRouteFuel = (
  ship: AllocationShip,
  stops: PlannedRouteStop[],
  distanceMap: Map<string, number>,
): boolean => {
  // A valid route must end at the ship's home port
  if (
    stops.length === 0 ||
    stops[stops.length - 1].portId !== ship.homePortId
  ) {
    return false;
  }

  // Include current position and the final return home
  const portSequence = [
    ship.currentPortId,
    ...stops.map((stop) => stop.portId),
  ];

  const legDistances: number[] = [];

  for (let i = 0; i < portSequence.length - 1; i++) {
    const fromPortId = portSequence[i];
    const toPortId = portSequence[i + 1];

    if (fromPortId === toPortId) {
      continue;
    }

    const distance = getPortDistance(
      distanceMap,
      fromPortId,
      toPortId,
    );

    if (distance === null || distance <= 0) {
      return false;
    }

    legDistances.push(distance);
  }

  return hasEnoughFuel(ship, legDistances);
};