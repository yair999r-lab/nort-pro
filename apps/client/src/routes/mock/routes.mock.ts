
import type { RouteInterface } from "@/routes/types/routes.types";

export const ROUTES_MOCK: RouteInterface[] = [
  {
    route_id: 1,
    origin_port_id: 1,
    destination_port_id: 2,
    distance_meters: 115000,
    geometry: {
      type: "LineString",
      coordinates: [
        [34.998, 32.819],
        [34.88, 32.55],
        [34.75, 32.25],
        [34.642, 31.829],
      ],
    },
    status: "active",
  },
  {
    route_id: 2,
    origin_port_id: 2,
    destination_port_id: 4,
    distance_meters: 240000,
    geometry: {
      type: "LineString",
      coordinates: [
        [34.642, 31.829],
        [34.1, 31.72],
        [33.5, 31.6],
        [32.9, 31.45],
        [32.3019, 31.2653],
      ],
    },
    status: "active",
  },
  {
    route_id: 3,
    origin_port_id: 1,
    destination_port_id: 4,
    distance_meters: 340000,
    geometry: {
      type: "LineString",
      coordinates: [
        [34.998, 32.819],
        [34.4, 32.4],
        [33.8, 32.0],
        [33.1, 31.7],
        [32.3019, 31.2653],
      ],
    },
    status: "inactive",
  },
];
