import { findRelevantRoutes } from '../helpers/find-relevant-routes.helpers';
import { getShipForRoute } from '../helpers/get-ship-for-route.helpers';
import { hasEnoughCapacity } from '../helpers/has-enough-capacity.helpers';
import { calculateShipSchedule } from '../helpers/calculate-ship-schedule.helpers';
import { isArrivalOnTime } from '../helpers/is-arrival-on-time.helpers';
import { matchScheduleWithExistingVoyages } from '../helpers/match-schedule-with-existing-voyages.helpers';

import type { MatchedVoyage } from '../helpers/match-schedule-with-existing-voyages.helpers';
import type { AllocationContext } from '../types/allocation.types';

import { loadAllocationContextFromDatabase } from './load-allocation-context.service';

import { buildRoutePlanForShip } from './build-route-plan-for-ship.service';
import type { RoutePlan } from '../types/route-planner.types';

export interface AllocationOption {
  routeId: string;
  shipId: string;
  shipName: string;
  arrivalAtOrigin: string;
  arrivalAtDestination: string;
  voyages: MatchedVoyage[];
}

// חישוב אפשרויות הקצאה על בסיס נתונים שהתקבלו מה-DB
export const calculateAllocationOptions = (
  shipmentId: string,
  data: AllocationContext,
): AllocationOption[] | null => {
  const shipment = data.shipments.find((item) => item.id === shipmentId);

  if (!shipment) {
    return null;
  }

  if (
    shipment.status !== 'pending' ||
    !Number.isFinite(shipment.weightKg) ||
    shipment.weightKg <= 0
  ) {
    return [];
  }

  // מציאת מסלולים פעילים שמתאימים למשלוח
  const relevantRoutes = findRelevantRoutes(
    shipment,
    data.routes.filter((route) => route.status === 'active'),
    data.routeStops,
  );

  const options: AllocationOption[] = [];

  for (const route of relevantRoutes) {
    const ship = getShipForRoute(route.id, data.ships);

    if (!route.plannedDepartureAt) {
      continue;
    }

    if (!ship || ship.status !== 'active') {
      continue;
    }

    // בדיקת קיבולת האונייה
    if (!hasEnoughCapacity(ship, shipment, [])) {
      continue;
    }

    // חישוב לוח הזמנים
    const schedule = calculateShipSchedule(
      ship,
      shipment,
      data.routeStops,
      data.portDistances,
      route.plannedDepartureAt,
    );

    if (!schedule) {
      continue;
    }

    // התאמת הפלגות קיימות או תכנון הפלגות חדשות
    const matchedVoyages = matchScheduleWithExistingVoyages(
      ship,
      shipment,
      schedule,
      data.voyages,
      data.routeVoyages,
    );

    if (!matchedVoyages || matchedVoyages.length === 0) {
      continue;
    }

    const arrivalAtDestination =
      matchedVoyages[matchedVoyages.length - 1].arrivalAt;

    // בדיקת מועד הגעה נדרש
    if (
      shipment.requiredArrival &&
      !isArrivalOnTime(arrivalAtDestination, shipment.requiredArrival)
    ) {
      continue;
    }

    options.push({
      routeId: route.id,
      shipId: ship.id,
      shipName: ship.name,
      arrivalAtOrigin: schedule.arrivalAtOrigin,
      arrivalAtDestination,
      voyages: matchedVoyages,
    });
  }

  return options;
};

export const buildAllocationOptionsFromDatabaseService = async (
  shipmentId: string,
): Promise<AllocationOption[] | null> => {
  const numericShipmentId = Number(shipmentId);

  if (!Number.isSafeInteger(numericShipmentId) || numericShipmentId <= 0) {
    return null;
  }

  const data = await loadAllocationContextFromDatabase();

  return calculateAllocationOptions(shipmentId, data);
};

export interface DynamicAllocationOption {
  shipId: string;
  shipName: string;
  totalDistanceNm: number;
  estimatedReturnAt: string;
  routePlan: RoutePlan;
}

export const calculateDynamicAllocationOptions = async (
  shipmentId: string,
  data: AllocationContext,
): Promise<DynamicAllocationOption[] | null> => {
  const shipment = data.shipments.find((item) => item.id === shipmentId);

  if (!shipment) return null;

  if (
    shipment.status !== 'pending' ||
    !Number.isFinite(shipment.weightKg) ||
    shipment.weightKg <= 0
  ) {
    return [];
  }

  const options: DynamicAllocationOption[] = [];

  for (const ship of data.ships) {
    if (ship.status !== 'active') continue;

    const routePlan = await buildRoutePlanForShip({
      ship,
      candidateShipment: shipment,
      data,
    });

    if (!routePlan) continue;

    options.push({
      shipId: ship.id,
      shipName: ship.name,
      totalDistanceNm: routePlan.totalDistanceNm,
      estimatedReturnAt: routePlan.estimatedReturnAt,
      routePlan,
    });
  }

  return options.sort((a, b) => a.totalDistanceNm - b.totalDistanceNm);
};

export const buildDynamicAllocationOptionsFromDatabaseService = async (
  shipmentId: string,
): Promise<DynamicAllocationOption[] | null> => {
  const numericShipmentId = Number(shipmentId);

  if (!Number.isSafeInteger(numericShipmentId) || numericShipmentId <= 0) {
    return null;
  }

  const data = await loadAllocationContextFromDatabase();

  return calculateDynamicAllocationOptions(shipmentId, data);
};
