import type {
  AllocationShip,
  AllocationShipment,
  AllocationVoyage,
} from '../types/allocation.types';

export function hasEnoughCapacity(
  ship: AllocationShip,
  shipment: AllocationShipment,
  relevantVoyages: AllocationVoyage[],
): boolean {
  if (shipment.weightKg > ship.capacityKg) {
    return false;
  }

  return relevantVoyages.every(
    (voyage) =>
      voyage.currentLoadWeightKg + shipment.weightKg <= ship.capacityKg,
  );
}