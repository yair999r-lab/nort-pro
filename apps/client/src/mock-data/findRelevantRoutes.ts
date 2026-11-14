import { routes, Shipment, Route } from './shippingMockData';
import { getRequiredRouteSegments } from './getRequiredRouteSegments';

export function findRelevantRoutes(shipment: Shipment): Route[] {
  return routes.filter(route => {
    const segments = getRequiredRouteSegments(route.id, shipment);

    return segments !== null;
  });
}