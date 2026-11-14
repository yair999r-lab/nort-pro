import type { AllocationShip } from '../types/allocation.types';

export function getShipForRoute(
  routeId: string,
  ships: AllocationShip[],
): AllocationShip | null {
  return ships.find((ship) => ship.routeId === routeId) ?? null;
}