export interface Port {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
}

export interface PortDistance {
  fromPortId: string;
  toPortId: string;
  distanceNm: number;
  distanceSource: string;
}

export interface Ship {
  id: string;
  name: string;
  homePortId: string;
  currentPortId: string | null;
  capacityKg: number;
  speedKnots: number;
  fuelTonsPerDay: number;
  routeId: string | null;
  status: string;
  fuelCapacityTons: number | null;
  fuelConsumptionTonsPerNm: number | null;
}

export interface Route {
  id: string;
  name: string;
  startPortId: string;
  endPortId: string;
  totalLengthNm: number;
  status: string;
}

export interface RouteStop {
  routeId: string;
  portId: string;
  stopOrder: number;
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

export interface Shipment {
  id: string;
  description: string | null;
  originPortId: string;
  destinationPortId: string;
  weightKg: number;
  requiredArrival: string | null;
  status: string;
}

export interface Voyage {
  id: string;
  shipId: string;
  fromPortId: string;
  toPortId: string;
  distanceNm: number;
  departureAt: string;
  arrivalAt: string;
  currentLoadWeightKg: number;
  status: string;
}

export interface RouteVoyage {
  routeId: string;
  voyageId: string;
  segmentOrder: number;
}

export interface ShippingData {
  ports: Port[];
  portDistances: PortDistance[];
  ships: Ship[];
  routes: Route[];
  routeStops: RouteStop[];
  shipments: Shipment[];
  voyages: Voyage[];
  routeVoyages: RouteVoyage[];
}

export interface MatchedVoyage {
  type: 'existing' | 'new';
  voyageId?: string;
  fromPortId: string;
  toPortId: string;
  departureAt: string;
  arrivalAt: string;
  carriesShipment: boolean;
}

export interface AllocationOption {
  shipId: string;
  shipName: string;
  totalDistanceNm: number;
  estimatedReturnAt: string;
  routePlan: RoutePlan;
}

export type ShipmentTableRow = Shipment & {
  originPortName: string;
  destinationPortName: string;
  weightDisplay: string;
  requiredArrivalDisplay: string;
};
