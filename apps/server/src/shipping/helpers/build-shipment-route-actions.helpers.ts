import type { AllocationShipment } from '../types/allocation.types';
import type { ShipmentRouteAction } from '../types/route-planner.types';

export const buildShipmentRouteActions = (
  shipments: AllocationShipment[],
): ShipmentRouteAction[] | null => {
  const actions: ShipmentRouteAction[] = [];

  for (const shipment of shipments) {
    if (
      !Number.isFinite(shipment.weightKg) ||
      shipment.weightKg <= 0 ||
      shipment.originPortId === shipment.destinationPortId
    ) {
      return null;
    }

    actions.push({
      shipmentId: shipment.id,
      portId: shipment.originPortId,
      action: 'pickup',
      weightKg: shipment.weightKg,
    });

    actions.push({
      shipmentId: shipment.id,
      portId: shipment.destinationPortId,
      action: 'delivery',
      weightKg: shipment.weightKg,
    });
  }

  return actions;
};