import { queryToPostgres } from '@libs/global';
import type { QueryResultRow } from 'pg';

import {
  selectAllRoutesQuery,
  insertDynamicRoutePlanQuery,
  activateDynamicRoutePlanQuery,
} from '../helpers/routes.helpers';

import type { RouteDbRow } from '../types/routes.db.types';

interface InsertedRoutePlanRow extends QueryResultRow {
  route_id: number;
  plan_version: number;
}

interface ActivatedRoutePlanRow extends QueryResultRow {
  route_id: number;
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

// Get all routes
export const getAllRoutesDAL = async (): Promise<RouteDbRow[]> => {
  return queryToPostgres<RouteDbRow, RouteDbRow>(selectAllRoutesQuery());
};

// Create a new dynamic route
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

// Activate new route and deactivate previous route
export const activateDynamicRoutePlanDAL = async (
  shipId: number,
  routeId: number,
): Promise<boolean> => {
  const rows = await queryToPostgres<
    { ship_id: number; route_id: number },
    ActivatedRoutePlanRow
  >(activateDynamicRoutePlanQuery(), [shipId, routeId]);

  return rows.some((row) => row.route_id === routeId);
};
