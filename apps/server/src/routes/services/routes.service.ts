import type { RouteInterface } from '@libs/united_packages';

import { getAllRoutesDAL } from '../dal/routes.dal';

const normalizeDate = (value: Date | string | null): string | null => {
  if (value === null) return null;
  return value instanceof Date ? value.toISOString() : value;
};

export const getAllRoutesService = async (): Promise<RouteInterface[]> => {
  const routes = await getAllRoutesDAL();

  return routes.map((route) => ({
    route_id: route.route_id,
    route_name: route.route_name,
    start_port_id: route.start_port_id,
    end_port_id: route.end_port_id,
    total_length_nm: Number(route.total_length_nm),
    status: route.status,

    ship_id: route.ship_id,
    route_kind: route.route_kind,
    planned_departure_at: normalizeDate(route.planned_departure_at),
    return_deadline_at: normalizeDate(route.return_deadline_at),
    estimated_return_at: normalizeDate(route.estimated_return_at),
    actual_return_at: normalizeDate(route.actual_return_at),
    plan_version: Number(route.plan_version),
    is_current_plan: route.is_current_plan,
  }));
};