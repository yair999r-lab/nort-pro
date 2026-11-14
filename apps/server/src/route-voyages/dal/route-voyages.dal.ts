import { queryToPostgres } from '@libs/global';

import {
  selectAllRouteVoyagesQuery,
  insertRouteVoyageQuery,
  insertDynamicRoutePlanQuery,
  activateDynamicRoutePlanQuery,
} from '../helpers/route-voyages.helpers';
import type { RouteVoyageDbRow } from '../types/route-voyages.db.types';
import type { RouteVoyageInterface } from '@libs/united_packages';

import type { QueryResultRow } from 'pg';

export const getAllRouteVoyagesDAL = async (): Promise<RouteVoyageDbRow[]> => {
  return queryToPostgres<RouteVoyageDbRow, RouteVoyageDbRow>(
    selectAllRouteVoyagesQuery(),
  );
};

export const insertRouteVoyageDAL = async (
  link: RouteVoyageInterface,
): Promise<boolean> => {
  const rows = await queryToPostgres<RouteVoyageInterface, RouteVoyageDbRow>(
    insertRouteVoyageQuery(),
    [link.route_id, link.voyage_id, link.segment_order],
  );

  return rows.length > 0;
};

interface InsertedRoutePlanRow extends QueryResultRow {
  route_id: number;
  plan_version: number;
}

interface InsertDynamicRouteInput {
  route_name: string;
  start_port_id: number;
  end_port_id: number;
  total_length_nm: number;
  ship_id: number;
  planned_departure_at: string;
  return_deadline_at: string;
  estimated_return_at: string;
}

export const insertDynamicRoutePlanDAL = async (
  input: InsertDynamicRouteInput,
): Promise<InsertedRoutePlanRow | null> => {
  const rows = await queryToPostgres<
    InsertDynamicRouteInput,
    InsertedRoutePlanRow
  >(insertDynamicRoutePlanQuery(), [
    input.route_name,
    input.start_port_id,
    input.end_port_id,
    input.total_length_nm,
    input.ship_id,
    input.planned_departure_at,
    input.return_deadline_at,
    input.estimated_return_at,
  ]);

  return rows[0] ?? null;
};

export const activateDynamicRoutePlanDAL = async (
  shipId: number,
  routeId: number,
): Promise<boolean> => {
  const rows = await queryToPostgres<
    { ship_id: number; route_id: number },
    InsertedRoutePlanRow
  >(activateDynamicRoutePlanQuery(), [shipId, routeId]);

  return rows.some((row) => row.route_id === routeId);
};
