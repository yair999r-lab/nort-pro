import type { AllocationShip } from '../types/allocation.types';

export const calculateRouteFuel = (
  ship: Pick<AllocationShip, 'fuelConsumptionTonsPerNm'>,
  legDistancesNm: number[],
): number | null => {
  const fuelPerNm = ship.fuelConsumptionTonsPerNm;

  if (
    !Number.isFinite(fuelPerNm) ||
    fuelPerNm === null ||
    fuelPerNm <= 0 ||
    legDistancesNm.length === 0
  ) {
    return null;
  }

  let totalDistanceNm = 0;

  for (const distance of legDistancesNm) {
    if (!Number.isFinite(distance) || distance <= 0) {
      return null;
    }

    totalDistanceNm += distance;
  }

  const totalFuelTons = totalDistanceNm * fuelPerNm;

  return Number.isFinite(totalFuelTons)
    ? totalFuelTons
    : null;
};