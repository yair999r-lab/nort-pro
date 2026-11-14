export interface AllocationShipment {
  id: string;
  description: string | null;
  originPortId: string;
  destinationPortId: string;
  weightKg: number;
  requiredArrival: string | null;
  status: string;
}

export interface AllocationShip {
  id: string;
  name: string;
  routeId: string;

  homePortId: string;
  currentPortId: string;

  capacityKg: number;
  speedKnots: number;

  fuelCapacityTons: number | null;
  fuelConsumptionTonsPerNm: number | null;

  // Legacy field - temporary
  fuelTonsPerDay: number;

  status: string;
}

export interface AllocationRoute {
  id: string;
  name: string;

  startPortId: string;
  endPortId: string;
  totalLengthNm: number;

  plannedDepartureAt: string | null;
  returnDeadlineAt: string | null;
  estimatedReturnAt: string | null;
  actualReturnAt: string | null;

  status: string;
  shipId: string | null;
  routeKind: string;
  isCurrentPlan: boolean;
  planVersion: number;
}
export interface AllocationRouteStop {
  routeId: string;
  portId: string;
  stopOrder: number;
}

export interface AllocationPortDistance {
  fromPortId: string;
  toPortId: string;
  distanceNm: number;
  routeGeometry: PortRouteGeometry | null;
}

export interface AllocationVoyage {
  id: string;
  shipId: string;
  fromPortId: string;
  toPortId: string;
  departureAt: string;
  arrivalAt: string;
  currentLoadWeightKg: number;
}

export interface AllocationRouteVoyage {
  routeId: string;
  voyageId: string;
  segmentOrder: number;
}

export interface AllocationContext {
  routes: AllocationRoute[];
  ships: AllocationShip[];
  shipments: AllocationShipment[];
  routeStops: AllocationRouteStop[];
  portDistances: AllocationPortDistance[];
  voyages: AllocationVoyage[];
  routeVoyages: AllocationRouteVoyage[];
  shipmentVoyages: AllocationShipmentVoyage[];
}

export interface AllocationShipmentVoyage {
  shipmentId: string;
  routeId: string | null;
  voyageId: string;
  legOrder: number;
}

export interface PortRouteGeometry {
  type: 'LineString';
  coordinates: [number, number][];
}
