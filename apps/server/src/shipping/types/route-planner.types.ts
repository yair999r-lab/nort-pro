export type ShipmentActionType = 'pickup' | 'delivery';

export interface RoutePlanningConstraints {
  plannedDepartureAt: string;
  returnDeadlineAt: string;
}

export interface ShipmentRouteAction {
  shipmentId: string;
  portId: string;
  action: ShipmentActionType;
  weightKg: number;
}

export interface PlannedRouteStop {
  portId: string;
  pickups: string[];
  deliveries: string[];
}

export interface RoutePlanLeg {
  fromPortId: string;
  toPortId: string;
  distanceNm: number;
  departureAt: string;
  arrivalAt: string;
  loadWeightKg: number;
  shipmentIds: string[];
}

export interface RoutePlan {
  shipId: string;
  stops: PlannedRouteStop[];
  legs: RoutePlanLeg[];
  totalDistanceNm: number;
  estimatedReturnAt: string;
  plannedDepartureAt: string;
  returnDeadlineAt: string;
}
