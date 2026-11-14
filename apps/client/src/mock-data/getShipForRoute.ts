import { ships, Ship } from './shippingMockData';

export function getShipForRoute(routeId: string): Ship | null {
  return ships.find(ship => ship.routeId === routeId) ?? null;
}