import type {
  PortInterface,
  RouteInterface,
  RouteVoyageInterface,
  VoyageInterface,
  PortDistanceInterface,
} from '@libs/united_packages';

import type {
  NormalizedRoute,
  GeoJsonLineString,
} from '@/routes/types/routes.types';

const buildRouteGeometry = (
  routeId: number,
  routeVoyages: RouteVoyageInterface[],
  voyages: VoyageInterface[],
  distances: PortDistanceInterface[],
): GeoJsonLineString | null => {
  const links = routeVoyages
    .filter((link) => link.route_id === routeId)
    .sort((a, b) => a.segment_order - b.segment_order);

  if (links.length === 0) return null;

  const coordinates: [number, number][] = [];

  for (const link of links) {
    const voyage = voyages.find(
      (item) => item.voyage_id === link.voyage_id,
    );

    if (!voyage) return null;

    const distance = distances.find(
      (item) =>
        item.from_port_id === voyage.origin_port_id &&
        item.to_port_id === voyage.destination_port_id,
    );

    const geometry = distance?.route_geometry;

    if (
      !geometry ||
      geometry.type !== 'LineString' ||
      geometry.coordinates.length < 2
    ) {
      return null;
    }

    const segmentCoordinates = geometry.coordinates;

    if (coordinates.length === 0) {
      coordinates.push(...segmentCoordinates);
      continue;
    }

    const last = coordinates[coordinates.length - 1];
    const first = segmentCoordinates[0];

    const sharesEndpoint =
      last[0] === first[0] &&
      last[1] === first[1];

    coordinates.push(
      ...(
        sharesEndpoint
          ? segmentCoordinates.slice(1)
          : segmentCoordinates
      ),
    );
  }

  return coordinates.length >= 2
    ? { type: 'LineString', coordinates }
    : null;
};

export const normalizeRoute = (
  route: RouteInterface,
  routeVoyages: RouteVoyageInterface[],
  voyages: VoyageInterface[],
  distances: PortDistanceInterface[],
  ports: PortInterface[],
): NormalizedRoute => {
  const startPort = ports.find(
    (port) => port.port_id === route.start_port_id,
  );

  const endPort = ports.find(
    (port) => port.port_id === route.end_port_id,
  );

  return {
    id: String(route.route_id),
    name: route.route_name,
    startPortId: String(route.start_port_id),
    endPortId: String(route.end_port_id),
    startPortName: startPort?.port_name ?? 'לא ידוע',
    endPortName: endPort?.port_name ?? 'לא ידוע',
    totalLengthNm: route.total_length_nm,
    geometry: buildRouteGeometry(
      route.route_id,
      routeVoyages,
      voyages,
      distances,
    ),
    status: route.status as NormalizedRoute['status'],
  };
};

export const normalizeRoutes = (
  routes: RouteInterface[],
  routeVoyages: RouteVoyageInterface[],
  voyages: VoyageInterface[],
  distances: PortDistanceInterface[],
  ports: PortInterface[],
): NormalizedRoute[] =>
  routes.map((route) =>
    normalizeRoute(
      route,
      routeVoyages,
      voyages,
      distances,
      ports,
    ),
  );