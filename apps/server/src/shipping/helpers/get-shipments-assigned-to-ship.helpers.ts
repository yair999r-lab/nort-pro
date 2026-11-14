import type { AllocationContext } from '../types/allocation.types';

export const getShipmentsAssignedToShip = (
  shipId: string,
  data: AllocationContext,
) => {
  // Find the ship's current dynamic route
  const currentRoute = data.routes.find(
    (route) =>
      route.shipId === shipId &&
      route.routeKind === 'trip_plan' &&
      route.isCurrentPlan &&
      route.status === 'active',
  );

  if (!currentRoute) return [];

  // Find shipments linked to this exact route version
  const assignedShipmentIds = new Set(
    data.shipmentVoyages
      .filter((link) => link.routeId === currentRoute.id)
      .map((link) => link.shipmentId),
  );

  return data.shipments.filter(
    (shipment) =>
      assignedShipmentIds.has(shipment.id) &&
      shipment.status === 'assigned',
  );
};