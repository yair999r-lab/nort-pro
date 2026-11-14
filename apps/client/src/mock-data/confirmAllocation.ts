import {
  shipments,
  ships,
  voyages,
  routeVoyages,
  shipmentVoyages,
  Voyage,
} from './shippingMockData';

import { AllocationOption } from './buildAllocationOptions';
import { hasEnoughCapacity } from './hasEnoughCapacity';
import { isArrivalOnTime } from './isArrivalOnTime';

export function confirmAllocation(
  shipmentId: string,
  option: AllocationOption,
): boolean {
  // 1. מציאת המשלוח והספינה
  const shipment = shipments.find((item) => item.id === shipmentId);

  const ship = ships.find((item) => item.id === option.shipId);

  if (!shipment || !ship) return false;

  if (
    shipment.status !== 'pending' ||
    ship.status !== 'active' ||
    ship.routeId !== option.routeId
  ) {
    return false;
  }

  // 2. בדיקת רציפות ההפלגות
  if (option.voyages.length === 0) return false;

  for (let i = 0; i < option.voyages.length; i++) {
    const current = option.voyages[i];

    if (
      !Date.parse(current.departureAt) ||
      !Date.parse(current.arrivalAt) ||
      Date.parse(current.arrivalAt) <= Date.parse(current.departureAt)
    ) {
      return false;
    }

    if (i > 0) {
      const previous = option.voyages[i - 1];

      if (
        previous.toPortId !== current.fromPortId ||
        Date.parse(current.departureAt) < Date.parse(previous.arrivalAt)
      ) {
        return false;
      }
    }
  }

  // 3. בדיקה מחודשת של הקיבולת בהפלגות קיימות
  const existingVoyages: Voyage[] = [];

  for (const planned of option.voyages) {
    if (planned.type !== 'existing') continue;

    if (!planned.voyageId) return false;

    const existing = voyages.find((voyage) => voyage.id === planned.voyageId);

    if (
      !existing ||
      existing.shipId !== ship.id ||
      existing.fromPortId !== planned.fromPortId ||
      existing.toPortId !== planned.toPortId
    ) {
      return false;
    }

    existingVoyages.push(existing);
  }

  if (!hasEnoughCapacity(ship, shipment, existingVoyages)) {
    return false;
  }

  // 4. בדיקה חוזרת של מועד האספקה
  const arrivalAtDestination =
    option.voyages[option.voyages.length - 1].arrivalAt;

  if (!isArrivalOnTime(arrivalAtDestination, shipment.requiredArrival)) {
    return false;
  }

  // 5. הכנת מזהים להפלגות החדשות
  const usedIds = new Set(voyages.map((voyage) => voyage.id));
  const resolvedVoyageIds: string[] = [];

  let counter = 1;

  for (const planned of option.voyages) {
    if (planned.type === 'existing') {
      resolvedVoyageIds.push(planned.voyageId!);
      continue;
    }

    let newId = `voyage-${ship.id}-${counter}`;

    while (usedIds.has(newId)) {
      counter++;
      newId = `voyage-${ship.id}-${counter}`;
    }

    usedIds.add(newId);
    counter++;

    const newVoyage: Voyage = {
      id: newId,
      shipId: ship.id,
      fromPortId: planned.fromPortId,
      toPortId: planned.toPortId,
      departureAt: planned.departureAt,
      arrivalAt: planned.arrivalAt,
      currentLoadWeightKg: shipment.weightKg,
    };

    voyages.push(newVoyage);
    resolvedVoyageIds.push(newId);
  }

  // 6. עדכון המשקל בהפלגות הקיימות
  existingVoyages.forEach((voyage) => {
    voyage.currentLoadWeightKg += shipment.weightKg;
  });

  // 7. יצירת קשרים בין המסלול להפלגות
  resolvedVoyageIds.forEach((voyageId) => {
    const exists = routeVoyages.some(
      (link) => link.routeId === option.routeId && link.voyageId === voyageId,
    );

    if (!exists) {
      routeVoyages.push({
        routeId: option.routeId,
        voyageId,
      });
    }
  });

  // 8. יצירת קשרים בין המשלוח להפלגות
  resolvedVoyageIds.forEach((voyageId) => {
    shipmentVoyages.push({
      shipmentId: shipment.id,
      voyageId,
    });
  });

  // 9. עדכון סטטוס המשלוח
  shipment.status = 'allocated';

  return true;
}
