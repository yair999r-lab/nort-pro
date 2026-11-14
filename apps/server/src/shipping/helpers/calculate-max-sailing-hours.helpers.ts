import type { AllocationShip } from '../types/allocation.types';

const FUEL_RESERVE_RATIO = 0.15;

export const calculateMaxSailingHours = (
  ship: Pick<
    AllocationShip,
    | 'fuelCapacityTons'
    | 'fuelConsumptionTonsPerNm'
    | 'speedKnots'
  >,
): number | null => {
  const {
    fuelCapacityTons,
    fuelConsumptionTonsPerNm,
    speedKnots,
  } = ship;

  if (
    fuelCapacityTons === null ||
    fuelConsumptionTonsPerNm === null ||
    fuelCapacityTons <= 0 ||
    fuelConsumptionTonsPerNm <= 0 ||
    speedKnots <= 0
  ) {
    return null;
  }

  const usableFuel =
    fuelCapacityTons * (1 - FUEL_RESERVE_RATIO);

  const maxDistanceNm =
    usableFuel / fuelConsumptionTonsPerNm;

  const maxSailingHours = maxDistanceNm / speedKnots;

  return Number.isFinite(maxSailingHours)
    ? maxSailingHours
    : null;
};