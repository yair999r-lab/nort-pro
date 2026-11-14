import axios from 'axios';

import type {
  RouteInterface,
  RouteVoyageInterface,
  VoyageInterface,
  PortDistanceInterface,
  PortInterface,
} from '@libs/united_packages';

import { normalizeRoutes } from '../helpers/routes.normalizers';

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export const getAllRoutes = async () => {
  const [
    routesResponse,
    routeVoyagesResponse,
    voyagesResponse,
    distancesResponse,
    portsResponse,
  ] = await Promise.all([
    axios.get<RouteInterface[]>(`${SERVER_URL}/routes`),
    axios.get<RouteVoyageInterface[]>(`${SERVER_URL}/route-voyages`),
    axios.get<VoyageInterface[]>(`${SERVER_URL}/voyages`),
    axios.get<PortDistanceInterface[]>(`${SERVER_URL}/port-distances`),
    axios.get<PortInterface[]>(`${SERVER_URL}/ports`),
  ]);

  // Only current active dynamic route plans
  const activeDynamicRoutes = routesResponse.data.filter(
    (route) =>
      route.route_kind === 'trip_plan' &&
      route.is_current_plan &&
      route.status === 'active',
  );

  return normalizeRoutes(
    activeDynamicRoutes,
    routeVoyagesResponse.data,
    voyagesResponse.data,
    distancesResponse.data,
    portsResponse.data,
  );
};