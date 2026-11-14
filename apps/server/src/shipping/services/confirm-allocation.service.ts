import type { AllocationShip } from '../types/allocation.types';
import type { RoutePlan } from '../types/route-planner.types';

import { loadAllocationContextFromDatabase } from './load-allocation-context.service';
import { buildRoutePlanForShip } from './build-route-plan-for-ship.service';
import { saveDynamicRoutePlan } from './save-dynamic-route-plan.service';

interface PreparedAllocation {
  shipmentId: number;
  ship: AllocationShip;
  plan: RoutePlan;
}

export const prepareAllocationPlanFromDatabase = async (
  shipmentId: string,
  shipId: string,
): Promise<PreparedAllocation | null> => {
  const numericShipmentId = Number(shipmentId);
  const numericShipId = Number(shipId);

  if (
    !Number.isSafeInteger(numericShipmentId) ||
    numericShipmentId <= 0 ||
    !Number.isSafeInteger(numericShipId) ||
    numericShipId <= 0
  ) {
    return null;
  }

  const data = await loadAllocationContextFromDatabase();

  const shipment = data.shipments.find((item) => item.id === shipmentId);

  const ship = data.ships.find((item) => item.id === shipId);

  if (
    !shipment ||
    shipment.status !== 'pending' ||
    !ship ||
    ship.status !== 'active'
  ) {
    return null;
  }

  const plan = await buildRoutePlanForShip({
    ship,
    candidateShipment: shipment,
    data,
  });

  if (!plan) return null;

  return {
    shipmentId: numericShipmentId,
    ship,
    plan,
  };
};

export const confirmAllocationFromDatabaseService = async (
  shipmentId: string,
  shipId: string,
) => {
  const prepared = await prepareAllocationPlanFromDatabase(shipmentId, shipId);

  if (!prepared) return null;

  const saved = await saveDynamicRoutePlan({
    ship: prepared.ship,
    plan: prepared.plan,
  });

  return {
    shipmentId: prepared.shipmentId,
    ...saved,
  };
};
