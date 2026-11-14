import { Ship, Shipment, Voyage } from './shippingMockData';

export function hasEnoughCapacity(
  ship: Ship,
  shipment: Shipment,
  relevantVoyages: Voyage[]
): boolean {

  // בדיקת קיבולת הספינה
  if (shipment.weightKg > ship.capacityKg) {
    return false;
  }

  // בדיקת קיבולת בכל הפלגה רלוונטית
  return relevantVoyages.every(voyage =>
    voyage.currentLoadWeightKg + shipment.weightKg
      <= ship.capacityKg
  );
}