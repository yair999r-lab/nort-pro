import type { AllocationShip } from '../types/allocation.types';
import { calculateRouteFuel } from './calculate-route-fuel.helpers';

// Required fuel reserve: 15%
const FUEL_RESERVE_RATIO = 0.15;

export const hasEnoughFuel = (
  ship: Pick<
    AllocationShip,
    'fuelCapacityTons' | 'fuelConsumptionTonsPerNm'
  >,
  legDistancesNm: number[],
): boolean => {
  const fuelCapacity = ship.fuelCapacityTons;

  // Missing or invalid fuel data means the route cannot be approved
  if (
    fuelCapacity === null ||
    !Number.isFinite(fuelCapacity) ||
    fuelCapacity <= 0
  ) {
    return false;
  }

  // Calculate fuel required for the complete route
  const requiredFuel = calculateRouteFuel(ship, legDistancesNm);

  if (requiredFuel === null) {
    return false;
  }

  // Keep the required fuel reserve untouched
  const usableFuel = fuelCapacity * (1 - FUEL_RESERVE_RATIO);

  return requiredFuel <= usableFuel;
};