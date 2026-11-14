export type ShipStatus = string;

export type NormalizedShip = {
  id: string;
  name: string;
  homePortId: string;
  currentPortId: string;
  routeId: string;
  capacityTons: string;
  speedKnots: string;
  fuelConsumptionTonsPerDay: string;
  status: ShipStatus;
};