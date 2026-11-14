import type {
  Shipment,
  Ship,
  Route,
  RoutePlanLeg,
} from './shipping.types';

export interface ShipmentAllocationRow extends Shipment {
  originPortName: string;
  destinationPortName: string;
  weightDisplay: string;
  requiredArrivalDisplay: string;
}

export interface ShipAllocationRow extends Ship {
  totalDistanceDisplay: string;
  estimatedReturnAtDisplay: string;
  capacityDisplay: string;
}

export interface RouteAllocationRow extends Route {
  shipId: string;
  shipName: string;
  stopsDisplay: string;
  departureAtDisplay: string;
  estimatedReturnAtDisplay: string;
  returnDeadlineAtDisplay: string;
}

export interface VoyageAllocationRow extends RoutePlanLeg {
  id: string;
  fromPortName: string;
  toPortName: string;
  departureAtDisplay: string;
  arrivalAtDisplay: string;
  distanceDisplay: string;
  voyageTypeDisplay: string;
  cargoStatusDisplay: string;
}