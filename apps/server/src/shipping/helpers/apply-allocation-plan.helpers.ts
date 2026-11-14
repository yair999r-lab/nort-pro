import {
  shipments,
  ships,
  voyages,
  routeVoyages,
  shipmentVoyages,
} from '../data/shipping.mock';

import type { AllocationPlan } from './build-allocation-plan.helpers';

export function applyAllocationPlan(
  shipmentId: string,
  plan: AllocationPlan,
): boolean {
  // מציאת המשלוח
  const shipment = shipments.find(
    (item) => item.id === shipmentId,
  );

  if (!shipment || shipment.status !== 'pending') {
    return false;
  }

  // בדיקה שכל ההפלגות הקיימות עדיין קיימות ויש להן מקום
  for (const update of plan.existingVoyageLoadUpdates) {
    const voyage = voyages.find(
      (item) => item.id === update.voyageId,
    );

    if (!voyage) {
      return false;
    }

    const ship = ships.find(
      (item) => item.id === voyage.shipId,
    );

    if (
      !ship ||
      voyage.currentLoadWeightKg + update.addedWeightKg >
        ship.capacityKg
    ) {
      return false;
    }
  }

  // בדיקת מזהי ההפלגות החדשות
  for (const newVoyage of plan.newVoyages) {
    const ship = ships.find(
      (item) => item.id === newVoyage.shipId,
    );

    if (
      voyages.some((item) => item.id === newVoyage.id) ||
      !ship ||
      newVoyage.currentLoadWeightKg > ship.capacityKg
    ) {
      return false;
    }
  }

  // אם כל הבדיקות עברו, מתחילים לבצע שינויים

  // עדכון משקל בהפלגות קיימות
  for (const update of plan.existingVoyageLoadUpdates) {
    const voyage = voyages.find(
      (item) => item.id === update.voyageId,
    );

    voyage!.currentLoadWeightKg += update.addedWeightKg;
  }

  // יצירת הפלגות חדשות
  voyages.push(...plan.newVoyages);

  // קישור ההפלגות החדשות למסלולים
  routeVoyages.push(...plan.newRouteVoyageLinks);

  // קישור המשלוח להפלגות שנושאות אותו
  shipmentVoyages.push(...plan.newShipmentVoyageLinks);

  // עדכון סטטוס המשלוח
  shipment.status = 'allocated';

  return true;
}