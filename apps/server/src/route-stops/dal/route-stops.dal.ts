import { queryToPostgres } from '@libs/global';

import { selectAllRouteStopsQuery } from '../helpers/route-stops.helpers';
import type { RouteStopDbRow } from '../types/route-stops.db.types';

import { insertDynamicRouteStopsQuery } from '../helpers/route-stops.helpers';

export const getAllRouteStopsDAL = async (): Promise<RouteStopDbRow[]> => {
  return queryToPostgres<RouteStopDbRow, RouteStopDbRow>(
    selectAllRouteStopsQuery(),
  );
};

interface InsertDynamicRouteStopInput {
  route_id: number;
  port_id: number;
  stop_order: number;
  planned_arrival_at: string | null;
  planned_departure_at: string | null;
}

export const insertDynamicRouteStopsDAL = async (
  stops: InsertDynamicRouteStopInput[],
): Promise<boolean> => {
  if (stops.length === 0) return false;

  const values = stops.flatMap((stop) => [
    stop.route_id,
    stop.port_id,
    stop.stop_order,
    stop.planned_arrival_at,
    stop.planned_departure_at,
  ]);

  const rows = await queryToPostgres<
    InsertDynamicRouteStopInput,
    RouteStopDbRow
  >(insertDynamicRouteStopsQuery(stops.length), values);

  return rows.length === stops.length;
};
