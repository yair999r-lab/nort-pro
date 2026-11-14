import type { RouteStopInterface } from '@libs/united_packages';

import { getAllRouteStopsDAL } from '../dal/route-stops.dal';

const normalizeDate = (value: Date | string | null): string | null => {
  if (value === null) return null;
  return value instanceof Date ? value.toISOString() : value;
};

export const getAllRouteStopsService = async (): Promise<RouteStopInterface[]> => {
  const routeStops = await getAllRouteStopsDAL();

  return routeStops.map((stop) => ({
    route_id: stop.route_id,
    port_id: stop.port_id,
    stop_order: stop.stop_order,
    planned_arrival_at: normalizeDate(stop.planned_arrival_at),
    planned_departure_at: normalizeDate(stop.planned_departure_at),
    actual_arrival_at: normalizeDate(stop.actual_arrival_at),
    actual_departure_at: normalizeDate(stop.actual_departure_at),
    stop_status: stop.stop_status,
  }));
};